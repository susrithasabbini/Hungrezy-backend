import { Contact } from "../models/index.js";

const TAG = "service.contact";

const sendContactMessage = async (contact) => {
  try {
    const newContact = new Contact({
      name: contact.name,
      email: contact.email,
      message: contact.message,
      subject: contact.subject,
    });
    await newContact.save();
    return {
      status: 200,
      message: "Success",
      data: newContact,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in sendContactMessage() => ${error}`);
    throw error;
  }
};

const getContactMessages = async () => {
  try {
    const contacts = await Contact.find();
    return {
      status: 200,
      message: "Success",
      data: contacts,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getContactMessages() => ${error}`);
    throw error;
  }
};

const updateContactMessage = async (req) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    const contact = await Contact.findById(id);
    contact.status = status;
    await contact.save();
    return {
      status: 200,
      message: "Success",
      data: contact,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateContactMessage() => ${error}`);
    throw error;
  }
};

export { sendContactMessage, getContactMessages, updateContactMessage };
