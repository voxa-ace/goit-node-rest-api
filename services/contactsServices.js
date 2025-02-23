import User from "../db/models/User.js";

const listContacts = async () => {
  return await User.findAll();
};

const getContactById = async (id) => {
  return await User.findByPk(id);
};

const addContact = async (data) => {
  return await User.create(data);
};

const removeContact = async (id) => {
  const contact = await User.findByPk(id);
  if (!contact) return null;
  
  await contact.destroy();
  return contact;
};

const updateContact = async (id, data) => {
  const contact = await User.findByPk(id);
  if (!contact) return null;

  await contact.update(data);
  return contact;
};

const updateStatusContact = async (id, { favorite }) => {
  const contact = await User.findByPk(id);
  if (!contact) return null;

  await contact.update({ favorite });
  return contact;
};

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
