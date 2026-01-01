import { Request, Response, NextFunction } from "express";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { Guest } from "../guest/guest.model";
import { cleanupGuestData } from "../../middleware/guest.auth.middleware";
// import crypto from "crypto";

exports.userInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: _id } = req.session;

    const user =
      (await User.findOne({ _id })) || (await Guest.findOne({ _id }));

    if (!user) {
      return res.status(200).json({
        userInfo: {
          isAuthenticated: false,
        },
      });
    }

    const isAuthenticated = !!user;

    const userInfo = {
      userId: _id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatar,
      userRole: user.userRole,
      isAuthenticated,
    };

    res.status(200).json({ userInfo });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.registUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const { firstName, lastName, email, password } = req.body;

    if (!user) return;

    const usedEmail = await User.findOne({ email });

    if (usedEmail) {
      return res.status(500).json({ message: "Email already exist" });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    // const verificationToken = crypto.randomBytes(32).toString("hex");
    // const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Stunden gültig

    const newUser = new User({
      ...user,
      firstName,
      lastName,
      email,
      password: hashedPw,
      // verification: {
      //   veryfiStatus: false,
      //   veryficationToken: verificationToken,
      //   verifyTokenExp: tokenExpires,
      // },
    });

    await newUser.save();

    // const verifyLink = `${process.env.FRONTEND_URL}/emailVerify?token=${verificationToken}`;

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: EMAIL_USER,
    //     pass: EMAIL_PASS,
    //   },
    // });

    // await transporter.sendMail({
    //   from: EMAIL_USER,
    //   to: email,
    //   subject: "E-Mail-Verification",
    //   text: `Please click on the current Link, to verify your E-Mail: ${verifyLink}`,
    //   html: `<p>Please click on the current Link, to verify your E-Mail:</p>
    //          <a href="${verifyLink}">${verifyLink}</a>`,
    // });

    res.status(200).json({
      message:
        "Registration successfully - Please check your inbox for the verification.",
    });
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please fill up all fields" });

    const findUserAccount = await User.findOne({ email });
    if (!findUserAccount)
      return res.status(400).json({ message: "wrong email or password" });

    // if (await findUserAccount.blockedAccount.blocked)
    //   return res.status(400).json({
    //     message: "Your Account is blocked apply to the Admin",
    //   });

    const comparedPw = await bcrypt.compare(password, findUserAccount.password);

    if (!comparedPw) {
      const currentCount = await findUserAccount.blockedAccount.wrongPwCounter;
      const changeBlockStatus = currentCount >= 3 && true;
      await User.findOneAndUpdate(
        { email },
        {
          blockedAccount: {
            wrongPwCounter: currentCount + 1,
            blocked: changeBlockStatus,
          },
        }
      );
      const failMessage =
        currentCount >= 3
          ? "Your Account got blocked because you failed to many times in a row"
          : `wrong email or password ${currentCount + 1} time failed`;
      return res.status(400).json({ message: failMessage });
    } else {
      await User.findOneAndUpdate(
        { email },
        {
          blockedAccount: {
            wrongPwCounter: 0,
            blocked: false,
          },
        }
      );
    }
    // bei Anfragen wird so indentifiziert ob der user auth ist

    req.session.userId = findUserAccount._id.toString();
    req.session.userRole = findUserAccount.userRole;
    req.session.save();
    res.status(200).json({ message: "Login successfully" });
  } catch (err) {
    res.status(500).json("Login failed");
  }
};

exports.logOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    if (!req.session) {
      return res.status(400).json({ message: "No active session" });
    }

    if (!userId) {
      return next();
    }
    if (req.session.userRole === "guest") {
      await cleanupGuestData(userId);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return next(err);
      }
      res.clearCookie("connect.sid"); // kein muss - löscht auch das Cookie im Browser
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
