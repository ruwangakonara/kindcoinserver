const CrewMember = require("../Home/UserController").Member;
const User = require("../Home/UserController").User;
const bcrypt = require("bcryptjs");

// logic to register a crew member to the system and update his/her details and get all crew members, get a single crew member details, remove crew member from the system

// register/signup a crew member
async function crewMember_signup(req, res) {
  try {
    console.log("Crew Mem Registration Start");
    // status has to be "crewmember" - it has to be come through the payload actually. tested through api client.
    // status = "crewmember";
    const {
      name,
      noOfOperations,
      // stellarid,
      // town,
      // profile_image,
      // certificate_image,
      phoneNo,
      userName,
      passWord,
      status,
    } = req.body;

    const hashedpass = bcrypt.hashSync(passWord, 8);

    const user = await User.create({
      username: userName,
      password: hashedpass,
      status,
    });

    const user_id = user._id;
    // const created_at = Date.now();
    const crewMember = await CrewMember.create({
      user_id,
      name,
      noOfOperations,
      // stellarid,
      // town,
      // profile_image,
      // certificate_image,
      phone: phoneNo,
      // created_at,,
      username: userName,
    });
    console.log("Crew Member Succesfully registered");
    console.log(crewMember);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}

/**
 * TESTED EXAMPLE
 *
 {
  "name":"Andrew NG",
  "noOfOperations":1,
  "stellarid":"stellar@1211432idufo",
  "town":"Polonnaruwa",
  "phoneNo":"0718993252",
  "username":"crewmem@kindcoin.net",
  "password":"crewMem@123",
  "status":"crewmember"
}
 */

// async function crewMember_update(req, res) {
//   try {
//   } catch (e) {}
// }

async function crewMember_delete(req, res) {
  try {
    const { user_id } = req.params.id;
    const member = await CrewMember.findOneAndDelete(user_id);
    res.status(200).json({ member });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

// assign a crew member for a goods donation task
// async function crewMember_assignTask(req, res) {
//   try {
//     // logic => get all goods donations. click assign . view members. choose a member.
//   } catch (e) {}
// }

// view all crew members
async function view_crewMembers(req, res) {
  try {
    console.log("view members");
    const members = await CrewMember.find().populate("user_id");
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}

// view a single crew member
async function view_single_member(req, res) {
  const user_id = req.params.id;

  try {
    console.log("single member");
    const members = await CrewMember.find().populate("user_id");
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}

//

module.exports = {
  crewMember_signup,
  // crewMember_update,
  // crewMember_assignTask,
  view_crewMembers,
  view_single_member,
  crewMember_delete,
};
