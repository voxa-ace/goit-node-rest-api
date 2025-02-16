import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = "./db/contacts.json";

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id) || null;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

const removeContact = async (id) => {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return deletedContact;
};

const updateContact = async (id, body) => {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
};

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
