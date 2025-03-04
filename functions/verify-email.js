const { createClient } = require('@supabase/supabase-js')

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
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
            headers: {
                'Content-Type': 'application/json',
                // Allow requests from your GitHub Pages domain
                'Access-Control-Allow-Origin': 'https://achepa83.github.io'
            },
            body: JSON.stringify({
                message: 'Email verified successfully'
            })
        }
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://achepa83.github.io'
            },
            body: JSON.stringify({
                message: error.message
            })
        }
    }
} 