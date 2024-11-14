const CrewMember = require("../../models/crew_member");
const User = require("../../models/user");

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
      stellarid,
      town,
      profile_image,
      certificate_image,
      phoneNo,
      username,
      password,
      status,
    } = req.body;

    const hashedpass = bcrypt.hashSync(password, 8);

    const user = await User.create({ username, password: hashedpass, status });

    const user_id = user._id;
    const created_at = Date.now();
    const crewMember = await CrewMember.create({
      user_id,
      name,
      noOfOperations,
      stellarid,
      town,
      profile_image,
      certificate_image,
      phoneNo,
      created_at,
    });
    console.log("Crew Member Succesfully registered");
    console.log(crewMember);
    res.sendStatus(200);
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

async function crewMember_update(req, res) {
  try {
  } catch (e) {}
}

// assign a crew member for a task
async function crewMember_assignTask(req, res) {
  try {
  } catch (e) {}
}

// view all crew members
async function view_crewMembers(req, res) {
  try {
  } catch (e) {}
}

//

module.exports = {
  crewMember_signup,
  crewMember_update,
  crewMember_assignTask,
  view_crewMembers,
};
