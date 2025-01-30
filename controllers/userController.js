const User = require('../Model/userModel.js');

// Function to get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
        console.log('Retrieve all users');
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

// Function to create a new user
const createUser = async (req, res) => {
    try {
        const { email, username, password, registrationDate } = req.body;
        const newUser = await User.create({ email, username, password, registrationDate });
        res.status(200).json(newUser);
        console.log('New user created');
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

  

module.exports = { getUsers, createUser,updateUser,deleteUser };
