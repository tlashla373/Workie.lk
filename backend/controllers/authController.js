import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// Register User
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //send welcome email
        const mailOption ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject:"Welcome  to workie.lk",
            text: `Hello ${name}, Welcome to workie.lk. your account has been created with email id : ${email}`
        }

        await transporter.sendMail(mailOption);
        return res.json({ success: true });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) { // ✅ fixed: only fail if passwords don't match
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Logged in successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Logout User
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


//Send Verification OTP email

export const sendVerify = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false,message:"Account is already verified"});
        }

       const otp = (Math.floor(100000 + Math.random() * 900000)); // generate random number for OTP

        user.verifyOtp = otp;
        useReducer.verifyOtpExpireAt =  Date.now() + 24* 60 * 60 * 1000; // set OTP expire time to 24 hours from now    
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email.email,
            subject:"Account Verification OTP",
            text: `Your OTP is ${otp} . verify your account using this`
        }

        await transporter.sendMail(mailOptions);
        res.json({success:true,message:"OTP sent to your email"});


    }catch (error){
        res.json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const {otp, userId} = req.body;
    
    if(!userId || !otp ){
        return res.json({success:false,message:"Missing Details"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }

        if(user.verifyOtp < Date.now()){
            return res.json({success:false,message:"OTP expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        
        await user.save();
        return res.json({success:true,message:"Email verified successfully"});
        
    }catch (error){
        res.json({ success: false, message: error.message });
    }
}
