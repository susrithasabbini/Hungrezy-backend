import { Admin } from "../models/index.js";
import { dbUtils } from "../utils/index.js";
import { shareAdminCredentialsEmail } from "./emailService.js";
import { Announcement } from "../models/index.js";

const TAG = "service.admin";

const getAdmins = async () => {
  try {
    const admins = await Admin.find({});
    return {
      status: 200,
      message: "Get Admins Successful!",
      data: admins,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getAdmins() => ${error}`);
    throw error;
  }
};

const setActive = async (id, active) => {
  const ObjectId = dbUtils.stringToObjectId(id);
  try {
    const admin = await Admin.findById(ObjectId);
    admin.active = active;
    await admin.save();
    return {
      status: 200,
      message: "Success",
      data: admin,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in setActive() => ${error}`);
    throw error;
  }
};

const shareAdminCredentials = async (id) => {
  const ObjectId = dbUtils.stringToObjectId(id);
  try {
    const admin = await Admin.findById(ObjectId);
    await shareAdminCredentialsEmail(
      admin.email,
      admin.password,
      admin.firstName + " " + admin.lastName
    );
    return {
      status: 200,
      message: "Success",
      data: admin,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in shareCredentials() => ${error}`);
    throw error;
  }
};

const announce = async (announcement, to) => {
  try {
    const newAnnouncement = new Announcement({
      announcement: announcement,
      to: to,
    });
    await newAnnouncement.save();
    return {
      status: 200,
      message: "Announcement sent!",
      data: newAnnouncement,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in announce() => ${error}`);
    throw error;
  }
};

const getAnnouncements = async (to) => {
  try {
    const announcements = await Announcement.find({ to: { $in: [to, "all"] } })
      .sort({ createdAt: "desc" })
      .exec();
    return {
      status: 200,
      message: "Get Announcements Successful!",
      data: announcements,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getAnnouncements() => ${error}`);
    throw error;
  }
};

export {
  getAdmins,
  setActive,
  shareAdminCredentials,
  announce,
  getAnnouncements,
};
