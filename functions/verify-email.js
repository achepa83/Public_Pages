const { createClient } = require('@supabase/supabase-js')

exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': 'https://achepa83.github.io',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers: {
                'Access-Control-Allow-Origin': 'https://achepa83.github.io'
            },
            body: 'Method Not Allowed' 
        }
    }

    try {
        const { token } = JSON.parse(event.body)
        
        // Initialize Supabase client with environment variables
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        )

        // Verify the token
        const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
        })

        if (error) throw error

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                message: 'Email verified successfully'
            })
        }
    } catch (error) {
        console.error('Verification error:', error)
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
                message: error.message
            })
        }
    }
} 