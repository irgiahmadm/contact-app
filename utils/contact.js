const fs = require('fs')
//making directory or folder
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

//creating .json file
const filePath = 'data/contacts.json'
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
}

const listContact = () => {
    const fileBuffer = fs.readFileSync(filePath, 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

const findContact = (phoneNumber) => {
    return listContact().find((contact) => contact.phoneNumber === phoneNumber)
}

const rewriteContact = (contacts) => {
    fs.writeFileSync(filePath, JSON.stringify(contacts))
}

const addContact = (contact) => {
    const contacts = listContact()
    contacts.push(contact)
    rewriteContact(contacts)
}


module.exports = { listContact, findContact, addContact }