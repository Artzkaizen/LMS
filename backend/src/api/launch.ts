import jwt from 'jsonwebtoken';
import express from 'express';

const router = express.Router();

router.post('/lti/launch', (req, res) => {
    const ltiLaunchToken = req.body.id_token;

    if (!ltiLaunchToken)
        return res.status(400).send('Missing LTI launch token');

    // Decode and verify the JWT from the LMS
    jwt.verify(
        ltiLaunchToken,
        process.env.LTI_PUBLIC_KEY || '',
        { audience: process.env.TOOL_CLIENT_ID },
        (err, decoded) => {
            if (err) return res.status(401).send('Invalid JWT');

            // Extract course information from the LTI launch
            if (!decoded || typeof decoded === 'string')
                return res.status(401).send('Invalid JWT');

            const context = (decoded as jwt.JwtPayload)[
                'https://purl.imsglobal.org/spec/lti/claim/context'
            ];
            const courseId = context.id;
            const courseLabel = context.label;
            const courseTitle = context.title;

            // Extract user information
            const userId = decoded.sub;
            const userRoles = (decoded as jwt.JwtPayload)[
                'https://purl.imsglobal.org/spec/lti/claim/roles'
            ];

            res.json({
                message: 'LTI launch successful',
                courseId: courseId,
                courseLabel: courseLabel,
                courseTitle: courseTitle,
                userId: userId,
                userRoles: userRoles
            });
        }
    );
});

export default router;
