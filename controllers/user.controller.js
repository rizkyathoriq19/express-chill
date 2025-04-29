import { userModel } from "../model/user.model.js"
import { hashPassword } from "../utils/hashPassword.js"

export const userController = {
    async createUser(req, res) {
        try {
            const { name, email, phone, password, passwordConfirmation } = req.body
            if (!name || !password) {
                return res.status(400).json({ message: 'Name and password are required' })
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const existingUser = await userModel.getUserbyName(name)
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' })
            }

            const hashedPassword = await hashPassword(password)

            const result = await userModel.createUser({ name, email, phone, password: hashedPassword })
            res.status(201).json({ message: 'User created successfully', data: result })
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message })
        }
    },

    async getAllUser(req, res) {
        try {
            const users = await userModel.getAllUser()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message })
        }
    },

    async getUserById(req, res) {
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

    async updateUser(req, res) {
        try {
            const { id } = req.params
            const { name, email, phone, password, passwordConfirmation } = req.body
            
            if (!name || !password) {
                return res.status(400).json({ message: 'Name and password are required' })
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const hashedPassword = await hashPassword(password)

            const result = await userModel.updateUser(id, { name, email, phone, password: hashedPassword })
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(200).json({ message: 'User updated successfully' })
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message })
        }
    },

    async softDeleteUser(req, res) {
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
    }
}