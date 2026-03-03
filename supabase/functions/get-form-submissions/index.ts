import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders } from '../_shared/cors.ts'

const ADMIN_PASSWORD = 'Smart4A@Lovable'
const ALLOWED_DOMAIN = 'fans.tw'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Support both legacy password auth and Supabase JWT auth
    const authHeader = req.headers.get('Authorization')
    let authorized = false

    if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
      // Legacy password auth
      authorized = true
    } else if (authHeader?.startsWith('Bearer ')) {
      // Supabase JWT auth - verify user, check domain, and check whitelist
      const supabaseAuth = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      )
      const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()
      if (!userError && user?.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
        // Check whitelist using service role
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        const { data: allowed } = await supabaseAdmin
          .from('allowed_users')
          .select('id')
          .eq('email', user.email!)
          .eq('is_active', true)
          .maybeSingle()
        if (allowed) {
          authorized = true
        }
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)
    const formType = url.searchParams.get('form') || 'student-club'

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let data = null
    let error = null

    if (formType === 'student-club') {
      const result = await supabaseAdmin
        .from('student_club_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'course-retraining') {
      const result = await supabaseAdmin
        .from('course_retraining_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'tuesday-meetup') {
      const result = await supabaseAdmin
        .from('tuesday_meetup_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'venue-rental') {
      const result = await supabaseAdmin
        .from('venue_rental_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'automation-marketplace') {
      const result = await supabaseAdmin
        .from('automation_marketplace_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'automation-marketplace-en') {
      const result = await supabaseAdmin
        .from('automation_marketplace_orders_en')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'template-store') {
      const result = await supabaseAdmin
        .from('template_store_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'template-store-en') {
      const result = await supabaseAdmin
        .from('template_store_orders_en')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'student-product-claim') {
      const result = await supabaseAdmin
        .from('student_product_claims')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'instructor-payment') {
      const result = await supabaseAdmin
        .from('instructor_payment_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'learning-video-confidentiality') {
      const result = await supabaseAdmin
        .from('learning_video_confidentiality')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'consulting-service') {
      const result = await supabaseAdmin
        .from('consulting_service_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'course-quiz') {
      const result = await supabaseAdmin
        .from('course_quiz_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'revenue-sharing-recipient') {
      const result = await supabaseAdmin
        .from('revenue_sharing_recipients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'payment-notification') {
      const result = await supabaseAdmin
        .from('payment_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'ai-digital-transform-course') {
      const result = await supabaseAdmin
        .from('ai_digital_transform_course_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'smart4a-member') {
      const result = await supabaseAdmin
        .from('smart4a_member_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'quotation') {
      const result = await supabaseAdmin
        .from('quotation_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'service-inquiry') {
      const result = await supabaseAdmin
        .from('service_inquiry_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'learning-satisfaction-survey') {
      const result = await supabaseAdmin
        .from('learning_satisfaction_surveys')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'prompt-mode-change') {
      const result = await supabaseAdmin
        .from('prompt_mode_changes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'product-management') {
      const result = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    } else if (formType === 'project-contract') {
      const result = await supabaseAdmin
        .from('project_contract_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      data = result.data
      error = result.error
    }

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching submissions:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
