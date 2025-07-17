const challengeStyle = [
  {
    icon: "Game/Icons/Vector.svg",
    colorHex: "#7C3AED",
    buttonColor: "#7C3AED",
    progressColor: "#7C3AED",
    iconBg: "#7C3AED33",
    shadow: "0 4px 16px 0 #7C3AED22",
  },
  {
    icon: "/Game/Icons/Vector(1).svg",
    colorHex: "#FACC15",
    buttonColor: "#FACC15",
    progressColor: "#FACC15",
    iconBg: "#FACC1533",
    shadow: "0 4px 16px 0 #FACC1522",
  },
  {
    icon: "/Game/Icons/Vector(2).svg",
    colorHex: "#4ADE80",
    buttonColor: "#4ADE80",
    progressColor: "#4ADE80",
    iconBg: "#4ADE8033",
    shadow: "0 4px 16px 0 #4ADE8022",
  },
];

const ChallengeCard = ({ challenge, index, active, onStart }) => {
  const style = challengeStyle[index % challengeStyle.length];

  return (
    <div key={challenge._id || challenge.id} className="col-md-4 d-flex">
      <div
        className="card challenge-card h-100 w-100"
        style={{
          boxShadow: style.shadow,
          borderLeft: `4px solid ${style.colorHex}`,
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column align-items-center">
            <div
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                background: style.iconBg,
                borderRadius: "50%",
                width: 56,
                height: 56,
              }}
            >
              <img
                src={style.icon}
                alt="icon"
                style={{ width: 40, height: 40 }}
              />
            </div>
            <h3 className="challenge-title mb-1">{challenge.title}</h3>
            <p className="challenge-description mb-4">
              {challenge.description}
            </p>
            <button
              className="w-100"
              style={{
                background: active ? "transparent" : style.buttonColor,
                color: active ? style.colorHex : "#fff",
                border: active ? `2px solid ${style.colorHex}` : "none",
                borderRadius: 20,
                fontWeight: "bold",
                fontSize: "1.1rem",
                padding: "0.5rem 0",
                boxShadow: active ? "none" : style.shadow,
                transition: "all 0.3s ease",
              }}
              onClick={() => onStart(challenge.id)}
            >
              {active ? "انهاء التحدى" : "ابدأ التحدي"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
