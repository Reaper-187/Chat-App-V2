import "../Spinner/spinner.css";

interface dynamicSpinnerScale {
  scale?: number;
}

export const Spinner = ({ scale }: dynamicSpinnerScale) => {
  const spinnerWidth = scale;
  return (
    <>
      <div className="banter-loader" style={{ scale: spinnerWidth }}>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <p className="loading-text">Loading...</p>
      </div>
    </>
  );
};
