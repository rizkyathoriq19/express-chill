import { userModel } from "../model/user.model.js"
import { deleteImage, getPublicIdFromUrl, uploadImageFromBuffer } from "../utils/cloudinary.js"
import { hashPassword } from "../utils/hashPassword.js"

export const userController = {
    createUser: async (req, res) => {
        try {
            const { fullname, username, email, phone, password, passwordConfirmation } = req.body
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' })
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const existingUser = await userModel.getUserbyUsername(username)
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' })
            }

            const hashedPassword = await hashPassword(password)

            const result = await userModel.createUser({ fullname, username, email, phone, password: hashedPassword })
            res.status(201).json({ message: 'User created successfully', data: result })
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message })
        }
    },

    getAllUser: async (req, res) => {
        try {
            const { c_page = 1, p_limit = 10, search = '', sortBy = 'updated_at', sortOrder = 'DESC' } = req.query
            const t_items = await userModel.totalFilteredUsers(search) 
            const t_page = Math.ceil(t_items / p_limit) 

            const users = await userModel.getAllUser(c_page, p_limit, search, sortBy, sortOrder)

            res.status(200).json({
                message: 'Users fetched successfully',
                metadata: {
                    current_page: Number(c_page),
                    total_page: t_page,
                    total_items: t_items,
                },
                data: users
            })

        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message })
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params
            const user = await userModel.getUserById(id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message })
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params
            const { fullname, username, email, phone, password, passwordConfirmation } = req.body
            
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' })
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const hashedPassword = await hashPassword(password)

            const result = await userModel.updateUser(id, { fullname, username, email, phone, password: hashedPassword })
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(200).json({ message: 'User updated successfully' })
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message })
        }
    },

    softDeleteUser: async (req, res) => {
        try {
            const { id } = req.params
            const user = await userModel.getUserById(id)
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            
            await userModel.softDeleteUser(id)
            res.status(200).json({ message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message })
        }
    },

    uploadImage: async (req, res) => { 
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' })
            }

            const { id } = req.params

            const user = await userModel.getUserById(id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            if (user.image) {
                const oldImagePublicId = await getPublicIdFromUrl(user.image)
                if (oldImagePublicId) await deleteImage(oldImagePublicId)
            }
            
            const imagePath = req.file.buffer
            const uploadImage = await uploadImageFromBuffer(imagePath, 'harisenin')
            if (!uploadImage) {
                return res.status(500).json({ message: 'Error uploading image' })
            }
            
            await userModel.uploadImage(id, uploadImage.secure_url)

            res.status(200).json({ message: 'Image uploaded successfully'})
        } catch (error) {
            res.status(500).json({ message: 'Error uploading image', error: error.message })
        }
    }
}