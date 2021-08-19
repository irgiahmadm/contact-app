const fs = require('fs')
//making directory or folder
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

//creating .json file
const filePath = './data/contacts.json'
if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, '[]', (err, data) => {
        console.log(err)
    })
}

const readFile = () => {
    const fileBuffer = fs.readFileSync(filePath, 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

const savingContact = (objContact) => {
    const contacts = readFile()

    const duplicate = contacts.find((contact) => contact.phoneNumber === objContact.phoneNumber)
    if (duplicate) {
        console.log(chalk.bgRed.white.bold("Phone number is registered"))
        return false
    }
    if (!validator.isEmail(objContact.email)) {
        console.log(chalk.bgRed.white.bold("Email is invalid"))
        return false
    }
    if (!validator.isMobilePhone(objContact.phoneNumber, 'id-ID')) {
        console.log(chalk.bgRed.white.bold("Phone number is invalid"))
        return false
    }
    contacts.push(objContact)
    fs.writeFile(filePath, JSON.stringify(contacts), (err) => {
        if (err) {
            console.log(err)
        }
    })
    console.log(chalk.green.inverse.bold("Data is succesfully added"))
}

const listContact = () => {
    const contacts = readFile()
    console.log(chalk.bgCyan.white.bold("Contact List"))
    contacts.forEach((contact, i = 1) => {
        console.log(`${i+1}. Name : ${contact.name} | Phone Number ${contact.phoneNumber}`)
    })
}

module.exports = { listContact }