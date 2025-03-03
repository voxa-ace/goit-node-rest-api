import Contact from "../db/models/Contact.js";

const listContacts = async (userId) => {
  return await Contact.findAll({ where: { owner: userId } });
};

const getContactById = async (id, userId) => {
  return await Contact.findOne({ where: { id, owner: userId } });
};

const addContact = async (data) => {
  return await Contact.create(data);
};

const removeContact = async (id, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) return null;
  
  await contact.destroy();
  return contact;
};

const updateContact = async (id, userId, data) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) return null;

  await contact.update(data);
  return contact;
};

const updateStatusContact = async (id, userId, { favorite }) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
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
