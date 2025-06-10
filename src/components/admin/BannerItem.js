import React, { useState } from "react";
import "../../styles/admin/BannerItem.css";
import { deleteAdminBanner, updateAdminBanner } from "../../api/adminApi";

const BannerItem = ({ banner, setIsFetch }) => {
  const [newBanner, setNewBanner] = useState(banner);
  const [isEditing, setIsEditing] = useState(false);

  const editBanner = async () => {
    try {
      await updateAdminBanner(banner.id, newBanner);
      setIsEditing(false);
      setIsFetch(true);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const deleteBanner = async () => {
    try {
      await deleteAdminBanner(banner.id);
      setIsFetch(true);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCancel = () => {
    setNewBanner(banner);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBanner(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="admin-banner-item">
      <div className="admin-banner-row">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="admin-banner-image"
        />

        <div className="admin-banner-info">
          {isEditing ? (
            <>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={newBanner.title}
                  onChange={handleChange}
                  className="admin-banner-input"
                />
              </label>
              <label>
                Link URL:
                <input
                  type="text"
                  name="linkUrl"
                  value={newBanner.linkUrl}
                  onChange={handleChange}
                  className="admin-banner-input"
                />
              </label>
              <label>
                Visible:
                <input
                  type="checkbox"
                  name="visible"
                  checked={newBanner.visible}
                  onChange={handleChange}
                />
              </label>
              <label>
                Priority:
                <input
                  type="number"
                  name="priority"
                  value={newBanner.priority}
                  onChange={handleChange}
                  className="admin-banner-input"
                />
              </label>
              <label>
                Starts At:
                <input
                  type="datetime-local"
                  name="startsAt"
                  value={newBanner.startsAt.slice(0, 16)}
                  onChange={handleChange}
                  className="admin-banner-input"
                />
              </label>
              <label>
                Ends At:
                <input
                  type="datetime-local"
                  name="endsAt"
                  value={newBanner.endsAt.slice(0, 16)}
                  onChange={handleChange}
                  className="admin-banner-input"
                />
              </label>
            </>
          ) : (
            <>
              <p><strong>Title:</strong> {newBanner.title}</p>
              <p><strong>Link:</strong> {newBanner.linkUrl}</p>
              <p><strong>Visible:</strong> {newBanner.visible ? "Yes" : "No"}</p>
              <p><strong>Priority:</strong> {newBanner.priority}</p>
              <p><strong>Starts At:</strong> {new Date(newBanner.startsAt).toLocaleString()}</p>
              <p><strong>Ends At:</strong> {new Date(newBanner.endsAt).toLocaleString()}</p>
            </>
          )}
        </div>
      </div>

      <div className="admin-banner-actions">
        {isEditing ? (
          <>
            <button onClick={editBanner}>Save</button>
            <button onClick={handleCancel} className="cancel">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteBanner} className="cancel">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerItem;