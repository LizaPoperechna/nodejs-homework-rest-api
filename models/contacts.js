const fs = require('fs/promises')
const path = require('path');
const { uuid } = require('uuidv4'); 


const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
    const result = JSON.parse(await fs.readFile(contactsPath));

    return result;
};

const getContactById = async (id) => {
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    const result = contacts.find((item) => item.id === id);
    return result || null;
};


const removeContact = async (id) => {

      const contacts = JSON.parse(await fs.readFile(contactsPath));
      const index = contacts.findIndex(item => item.id === id);
  
      if (index === -1) {
        return null;
      }

      const [result] = contacts.splice(index,1);

      await fs.writeFile(contactsPath, JSON.stringify(contacts, null,2));

      return result;
    };
 
const addContact = async ({name, email, phone}) => {

    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const newContact = {
      id: uuid(),
      name: name,
      email: email, 
      phone: phone
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    return newContact;
};

const updateContact = async(id, data) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const index = contacts.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  contacts[index] = {id, ...data};
  
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}