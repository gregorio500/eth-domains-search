const fs = require("fs")

// const sortNames = (file, type) => {
//     linesToSort = []    

//     try {
//         const list = fs.readFileSync(`./${file}.txt`, {encoding:'utf8', flag:'r'})
//         const lines = list.split(/\r?\n/)

//         for(let line of lines) {
//             const lineSlice = line.slice(0, line.length-11).replace(/ +/g, "-").split("-")
//             const hourMinute = lineSlice[lineSlice.length - 2]
//             const yearMonthDay = lineSlice[lineSlice.length - 4]
//             const fullDate = new Date(`${yearMonthDay} ${hourMinute} UTC+01:00`)

//             const editLine = line.replace(/" "/g, "") 
//             fullDate instanceof Date && !isNaN(fullDate) ? linesToSort.push({editLine, fullDate}) : console.log('date is not valid or empty line')
//         }
//         linesToSort.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        
//         const convertLines = new Set(linesToSort)  // remove doubling the domians
//         fs.writeFileSync(`./${file}.txt`,"", {encoding:'utf8'}, (err)=> err ? console.log('deleting has na error') : console.log('file is deleted'))
//         Array.from(convertLines).forEach(val => {
//             fs.appendFileSync(`./${file}.txt`, val.editLine+'\n', {encoding:'utf8'}, (err)=> err ? console.log('overwrite has na error') : console.log('file is overwrite succesfully'))
//             // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
//         })
//         console.log('lines to sort ->>> ')
//         console.log(linesToSort)


//     } catch(err) {
//         console.log("Issue with the file "+err)
//     }

// }

// sortNames('expires-period')
// sortNames('available-premium')
// sortNames('grace-period')


////////////////////

const readFile = (file) => {
    const linesToSort = new Array()    
    let list
    try {
        list = fs.readFileSync(`./${file}.txt`, {encoding:'utf8', flag:'r'})
    } catch(err) { console.log('issue with reading a file '+err) }
    
    const lines = list.split(/\r?\n/)
        for(let line of lines) {
            const lineSlice = line.slice(0, line.length-11).replace(/ +/g, "-").split("-")
            const hourMinute = lineSlice[lineSlice.length - 2]
            const yearMonthDay = lineSlice[lineSlice.length - 4]
            const fullDate = new Date(`${yearMonthDay} ${hourMinute} UTC+01:00`)

            const editLine = line.replace(/" "/g, "") 
            fullDate instanceof Date && !isNaN(fullDate) ? linesToSort.push({editLine, fullDate}) : console.log('date is not valid or empty line')
        }
    return linesToSort
}


const sortNames = (file) => {

    const linesToSort = readFile(file)
    linesToSort.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
    console.log('lines to sort ->>> ')
    console.log(linesToSort)  
    return linesToSort

}

const updateFiles = (file) => {
    const arrayOfLines = sortNames(file)
    const convertLines = new Set(arrayOfLines)  // remove doubling the domains
    fs.writeFileSync(`./${file}.txt`,"", {encoding:'utf8'}, err => err ? console.log('deleting has na error '+err) : console.log('file is deleted'))
    Array.from(convertLines).forEach(val => {
        fs.appendFileSync(`./${file}.txt`, val.editLine+'\n', {encoding:'utf8'}, err => { if(err) { console.log('overwrite has na error')} }) 
    })
}

const listOfFiles = ['expires-period', 'available-premium', 'grace-period']
for (let file of listOfFiles) {
    updateFiles(file)
}


