import multer from 'multer'
import path from 'path'

// Note : Please provide path based on the function's location. Location of this function is /Server/utilty.
// Practice path here and paste as it is in as an argument you're willing to call

const __dirname = path.join(process.cwd(), `/src`);
console.log(__dirname)

const multerConfig = (uploadPath = `./uploads/avatars`) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const link = path.join(__dirname, uploadPath)
            cb(null, link)
        },
        filename: (req, file, cb) => {
            cb(null, `Avatar-${new Date().getTime()}-${file.originalname}`)
        },
    })
    return multer({ storage: storage })
}

export default multerConfig

