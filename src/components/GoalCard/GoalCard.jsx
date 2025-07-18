import React from "react";

const GoalCard = ({
  goal,
  type,
  onDelete,
  onEdit,
  isEditing,
  editGoalData,
  setEditGoalData,
  handleSaveEdit,
  handleCancelEdit
}) => {
  const colors = {
    smart: "#6C5DD3",
    manual: "#2563EB",
    done: "#00C48C",
  };

  return (    
    <div
      className={`goal-card-custom ${
        type === "done"
          ? "goal-card-green goal-card-done goal-card-done-figma"
          : type === "manual"
          ? "goal-card-blue goal-card-progress goal-card-figma goal-card-blue-gradient"
          : "goal-card-purple goal-card-progress goal-card-figma"
      }`}
    >
      {/* Badge */}
      <div className={`goal-badge-${type}`}>
        <img
          src={
            type === "done"
              ? "/Goals/Icons/Vector(5).svg"
              : "/Goals/Icons/Vector(1).svg"
          }
          className="goal-badge-icon"
        />
        <span>
          {type === "done" ? "مكتمل" : type === "manual" ? "يدوي" : "جديد"}
        </span>
      </div>

      {/* Title */}
      <div className="goal-title-figma">{goal.title}</div>

      {/* Progress or Check */}
      {type === "done" ? (
        <div className="goal-check-figma">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="60" fill="#00C48C" fillOpacity="0.15" />
            <path
              d="M38 62l18 18 26-26"
              stroke="#fff"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <div className="goal-progress-circle-figma">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r="40"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="7"
            />
            <circle
              cx="45"
              cy="45"
              r="40"
              fill="none"
              stroke={colors[type]}
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={(1 - goal.progress / 100) * 2 * Math.PI * 40}
              style={{ transition: "stroke-dashoffset 0.5s" }}
            />
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              fontSize="1.5rem"
              fill={colors[type]}
              fontWeight="bold"
            >
              {goal.progress}%
            </text>
          </svg>
        </div>
      )}

      {/* Amounts */}
      {type !== "done" ? (
        <div className="goal-amounts-figma">
          <div>
            <span className="goal-label">المبلغ:</span>
            <span className="goal-value">
              {goal.targetAmount.toLocaleString()} ج.م
            </span>
          </div>

          <div>
            <span className="goal-label">المتحقق:</span>
            {isEditing ? (
              <input
                type="number"
                className="form-control"
                value={editGoalData.currentAmount}
                onChange={(e) =>
                  setEditGoalData((prev) => ({
                    ...prev,
                    currentAmount: e.target.value,
                  }))
                }
              />
            ) : (
              <span className="goal-value goal-value-green">
                {goal.currentAmount.toLocaleString()} ج.م
              </span>
            )}
          </div>

          <div>
            <span className="goal-label">المتبقي:</span>
            <span className="goal-value goal-value-red">
              {goal.remainingAmount.toLocaleString()} ج.م
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="goal-done-msg-figma">🎉 تم إنجاز الهدف بنجاح!</div>
          <div className="goal-done-amount">
            {goal.targetAmount.toLocaleString()} ج.م
          </div>
        </>
      )}

      {/* Actions */}
      {type !== "done" && (
        <div className="goal-actions-figma">
          <button onClick={onDelete} className="goal-delete-btn-figma">
            <img src="/Goals/Icons/Frame(3).svg" alt="حذف" />
          </button>

          {isEditing ? (
            <>
            <button
              onClick={handleSaveEdit}
              className="btn btn-success btn-sm px-3"
            >
              حفظ
            </button>
            <button
            onClick={handleCancelEdit}
              className="btn btn-success btn-sm px-3"
            >
              الغاء
            </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className={`goal-edit-btn-figma ${
                type === "manual" ? "goal-edit-btn-blue" : ""
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path
                  d="M2 14.5V16h1.5l8.06-8.06-1.5-1.5L2 14.5zM15.41 6.09a1 1 0 0 0 0-1.41l-2.09-2.09a1 1 0 0 0-1.41 0l-1.13 1.13 3.5 3.5 1.13-1.13z"
                  fill="#fff"
                />
              </svg>
              تعديل
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
