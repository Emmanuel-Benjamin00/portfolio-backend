import userModel from "../models/User.js";
import nodemailer from 'nodemailer'


const createAndMailUsers = async (req, res) => {

    //Function for handle use creation and Email
    const handleUserCreationAndEmail = (message) => {
        if (req.body.email && req.body.email !== "") {
            const myMail = "emmanuel26112000@gmail.com"

            sendMailtoSender(req.body.email)
            sendMail(myMail)

            res.status(201).send({
                message: message
            })
        }
        else {
            res.status(400).send(`Mail not sent`)
        }
    }

    //Send mail to me
    async function sendMail(mailReceiver) {
        try {
            // Create Transporter with email configuration
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Email Content
            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: mailReceiver,
                subject: `${req.body.name} Contacted through portfolio form`,
                text: `${req.body.message}\n\n My mail id is ${req.body.email}\n\n Thanks and Regards \n${req.body.name}`
            };

            // Send mail
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.log('Error sending email:', error);
        }
    }

    //Send mail to sender
    async function sendMailtoSender(mailReceiver) {
        try {
            // Create Transporter with email configuration
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Email Content
            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: mailReceiver,
                subject: `Message from Emmanuels Portfolio`,
                text: `Dear ${req.body.name},\n\n Your message through Emmanuel's Portfolio is successfully sent.
                     \n Emmanuel will be responding you shortly. \n Thank you \n\n This is an auto generated mail. Please dont reply this.\n
                     If you have any doubts contact emmanuel26112000@gmail.com.`
            };

            // Send mail
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }
        catch (error) {
            console.log('Error sending email:', error);
        }
    }

    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            await userModel.create(req.body)
            handleUserCreationAndEmail("User Created and Mailed Successfully")
        }
        else {
            handleUserCreationAndEmail("User already available and mailed successfully")
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export default {
    createAndMailUsers
}