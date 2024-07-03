import React, { useEffect, useState } from "react";
import { useAppcontext } from "../../context/appContext";
import Loading from "../../components/Loading";
import "../../assets/wrappers/stats.css";
import { Checkmark } from "react-checkmark";

function Notification({ refreshNotification, setRefreshNotification }) {
  const {
    getNotificationsByUser,
    notifications,
    isLoading,
    DeleteAllNotifications,
  } = useAppcontext();

  useEffect(() => {
    getNotificationsByUser();
  }, [refreshNotification]);

  useEffect(() => {
    if (refreshNotification) {
      setRefreshNotification(false);
    }
  }, [refreshNotification, setRefreshNotification]);

  if (isLoading) {
    return <Loading center />;
  }

  if (!notifications || notifications.length === 0) {
    return <h1>No notifications available</h1>;
  }
  const handleDelete = async () => {
    await DeleteAllNotifications();
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Tri des notifications par ordre décroissant de leur date de création
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <div>
        <button className="top-right-button" onClick={() => handleDelete()}>
          Clear All
        </button>
      </div>
      <div style={{ marginTop: "40px" }} />
      {sortedNotifications.map((notification) => {
        const iconColor = notification.type === "Good" ? "green" : "red";
        const anomalyReasons = Array.isArray(notification.anomalyReason)
          ? notification.anomalyReason.join(", ")
          : notification.anomalyReason;
        return (
          <div className="job_card" key={notification._id}>
            <div className="job_details">
              <div className="img">
                <Checkmark color={iconColor} />
              </div>
              <div className="textfx">
                <h4>
                  {notification.patientName} {notification.patientLastName}
                </h4>
                <p className="ellipsis">{anomalyReasons} </p>
                {/*<span>{notification.type}</span> */}
              </div>
            </div>
            <div className="job_salary">
              <h4>{formatDate(notification.createdAt)}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Notification;
