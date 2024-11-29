const User = require("../../models/user");
const Donor = require("../../models/donor");
const Beneficiary = require("../../models/beneficiary");
const CrewMember = require("../../models/crew_member");
const Admin = require("../../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../../models/member");
const emails = require("../../Middleware/Home/transporter")

async function signup(req, res) {
  console.log(req.body);

  try {
    const {
      username,
      password,
      status,
      name,
      district,
      type,
      phoneNo,
      date_of_birth,
    } = req.body;

    const hashedpass = bcrypt.hashSync(password, 8);

    const user = await User.create({ username, password: hashedpass, status });

    const user_id = user._id;

        // const user = await User.create({username, password: hashedpass, status})
        console.log("done")
        // const user_id = user._id

        // const {} = req.body;

        // if(type === "individual"){
        //     const {date_of_birth} = req.body
        //     const donor = await Donor.create({user_id, name, username, district, type, date_of_birth, phoneNo})
        //
        // } else {
        //     const {date_of_birth} = req.body x

            const donor = await Donor.create({user_id, name, username, district, type, date_of_birth, phoneNo})
        console.log("Yo")

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' });

    // Send verification email
    const verificationLink = `http://localhost:3000/verify/${token}`;

       const info = emails.sendVerificationEmail(username,  verificationLink, donor, "Donor")

        // }
    res.status(200).json({type: "donor", donor});

    } catch (err){
        console.log(err)
        res.sendStatus(400);
    }

    // }
  //   res.sendStatus(200);
  // } catch (err) {
  //   res.sendStatus(400);
  //   console.log(err);
  // }
}

async function verify(req, res){

  console.log(req.body);

  const { token } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: 'Invalid token.' });

    var details

    if(user.status === "donor") {

      details = await Donor.findOne({user_id: user._id});

    } else
      // if(user.status === "beneficiary")
      {

      details = await Beneficiary.findOne({user_id: user._id});

    }

    if (details.email_verified) return res.status(400).json({ message: 'Username already verified.' });

    if(user.status === "donor") {

      details = await Donor.findByIdAndUpdate(details._id, {email_verified: true}, {new: true});

    } else
        // if(user.status === "beneficiary")
    {

      details = await Beneficiary.findByIdAndUpdate(details._id, {email_verified: true}, {new: true});

    }
    // Mark user as verified
    // user.isVerified = true;
    // await user.save();

    res.status(200).json({ message: 'Email verified successfully!', details, status: user.status });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

async function beneficiary_registration(req, res) {
  try {
    console.log("dawg");
    const {
      username,
      password,
      status,
      date_of_birth,
      name,
      type,
      district,
      phoneNo,
    } = req.body;

    const hashedpass = bcrypt.hashSync(password, 8);

    const user = await User.create({ username, password: hashedpass, status });

    const user_id = user._id;
    // const {} = req.body;

    // if(type === "individual"){
    //     const {date_of_birth} = req.body
    const beneficiary = await Beneficiary.create({
      user_id,
      name,
      phoneNo,
      username,
      district,
      type,
      date_of_birth,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' });

    // Send verification email
    const verificationLink = `http://localhost:3000/verify/${token}`;

    const info = emails.sendVerificationEmail(username,  verificationLink, beneficiary, "Beneficiary")
    // } else {
    //     const {} = req.body

    // const beneficiary = await Beneficiary.create({user_id, name, description, username, district, type, date_of_birth})

    // }
    // }
    console.log("Succesfully registered");
    res.status(200).json({type: "beneficiary", beneficiary});
  } catch (err) {
    res.sendStatus(400);
  }
}

async function crewMember_registration(req, res) {
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

// temporary function
async function admin_signup(req, res) {
  try {
    console.log("admin signup Start");
    // status has to be "admin" - it has to be come through the payload actually.
    // status = "admin";
    // profile_image = "";
    const { name, username, profile_image, phoneNo, password, status } =
      req.body;

    const hashedpass = bcrypt.hashSync(password, 8);

    const user = await User.create({ username, password: hashedpass, status });

    const user_id = user._id;
    const created_at = Date.now();
    const admin = await Admin.create({
      user_id,
      name,
      username,
      profile_image,
      phoneNo,
      created_at,
    });
    console.log("Admin Succesfully signup");
    console.log(admin);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
}

async function signin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      console.log("Nigga!!");
      return res.sendStatus(420);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.sendStatus(409);
    }

    const exp = Date.now() + 1000 * 60 * 60 * 24 * 10;
    const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

    res.cookie("Authorization", token, {
      expires: new Date(exp),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Include the user in the response body
    if (user.status === "donor") {
      console.log("donor signin");
      const donor = await Donor.findOne({ user_id: user._id });
      res.status(200).json({ user: user, donor: donor });
    } else if (user.status === "beneficiary") {
      console.log("beneficiary signin");
      const beneficiary = await Beneficiary.findOne({ user_id: user._id });
      res.status(200).json({ user: user, beneficiary: beneficiary });
    } else if (user.status === "crewmember") {
      console.log("crew member signin");
      const crewMember = await CrewMember.findOne({ user_id: user._id });
      res.status(200).json({ user: user, crewMember: crewMember });
    } else {
      const admin = await Admin.findOne({ user_id: user._id });
      console.log("admin signin");
      res.status(200).json({ user: user, admin: admin });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function checkAuth(req, res) {
  try {
    console.log(req.user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function signout(req, res) {
  console.log("Sign out in");
  try {
    res.clearCookie("Authorization");
    console.log("Sign out successfully");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

module.exports = {
  signin,
  signout,
  signup,
  beneficiary_registration,
  crewMember_registration,
  admin_signup,
  checkAuth,
  Beneficiary,
  Donor,
  Member,
  verify,
  User
};
