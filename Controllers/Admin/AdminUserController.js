// get all users, remove user from system.

const User = require("../../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = User.find(req.body);
    res.status(200).json({ requests: users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = User.deleteOne(req.params.id);
    res.status(200).json({ requests: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

  // try{
  //     const {user_id, id} = req.body

  //     const user = await User.findOne({_id: id})

  //     if(donation){
  //         if (donation.user_id === user_id){
  //             await Donation.deleteOne({_id: id})

  //             res.status(200).send()
  //         } else {
  //             res.status(401).send()
  //         }
  //     } else {
  //         res.status(401).send()
  //     }

  // }
};

module.exports = {
  getAllUsers,
  removeUser,
};
