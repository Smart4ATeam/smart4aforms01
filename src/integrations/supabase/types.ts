export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_digital_transform_course_registrations: {
        Row: {
          ai_level: string
          attendee_count: number
          company_name: string | null
          course_name: string
          created_at: string
          email: string
          full_name: string
          goals: string | null
          id: string
          invoice_title: string | null
          invoice_type: string
          job_title: string | null
          line_id: string | null
          notes: string | null
          participation_type: string
          payment_method: string
          phone: string
          referrer: string | null
          session: string
          subsidy_tax_id: string | null
          tax_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          ai_level: string
          attendee_count?: number
          company_name?: string | null
          course_name: string
          created_at?: string
          email: string
          full_name: string
          goals?: string | null
          id?: string
          invoice_title?: string | null
          invoice_type: string
          job_title?: string | null
          line_id?: string | null
          notes?: string | null
          participation_type: string
          payment_method: string
          phone: string
          referrer?: string | null
          session: string
          subsidy_tax_id?: string | null
          tax_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          ai_level?: string
          attendee_count?: number
          company_name?: string | null
          course_name?: string
          created_at?: string
          email?: string
          full_name?: string
          goals?: string | null
          id?: string
          invoice_title?: string | null
          invoice_type?: string
          job_title?: string | null
          line_id?: string | null
          notes?: string | null
          participation_type?: string
          payment_method?: string
          phone?: string
          referrer?: string | null
          session?: string
          subsidy_tax_id?: string | null
          tax_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      allowed_users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      automation_marketplace_orders: {
        Row: {
          activation_date: string | null
          address: string | null
          app_id: string | null
          automation_module: string
          created_at: string | null
          currency: string | null
          distributor_id: string | null
          email: string
          id: string
          invoice_title: string | null
          invoice_type: string | null
          lovable_email: string | null
          make_organization_id: string | null
          name_or_company: string
          original_expiry_date: string | null
          original_key: string | null
          original_order_number: string | null
          payment_method: string | null
          phone: string | null
          plan: string
          postal_code: string | null
          purchase_months: string | null
          referral_code: string | null
          tax_id: string | null
          total_cost: number
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          activation_date?: string | null
          address?: string | null
          app_id?: string | null
          automation_module: string
          created_at?: string | null
          currency?: string | null
          distributor_id?: string | null
          email: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          lovable_email?: string | null
          make_organization_id?: string | null
          name_or_company: string
          original_expiry_date?: string | null
          original_key?: string | null
          original_order_number?: string | null
          payment_method?: string | null
          phone?: string | null
          plan: string
          postal_code?: string | null
          purchase_months?: string | null
          referral_code?: string | null
          tax_id?: string | null
          total_cost: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          activation_date?: string | null
          address?: string | null
          app_id?: string | null
          automation_module?: string
          created_at?: string | null
          currency?: string | null
          distributor_id?: string | null
          email?: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          lovable_email?: string | null
          make_organization_id?: string | null
          name_or_company?: string
          original_expiry_date?: string | null
          original_key?: string | null
          original_order_number?: string | null
          payment_method?: string | null
          phone?: string | null
          plan?: string
          postal_code?: string | null
          purchase_months?: string | null
          referral_code?: string | null
          tax_id?: string | null
          total_cost?: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      automation_marketplace_orders_en: {
        Row: {
          activation_date: string | null
          app_id: string | null
          automation_module: string
          country: string | null
          created_at: string | null
          currency: string | null
          distributor_id: string | null
          email: string
          id: string
          lovable_email: string | null
          make_organization_id: string | null
          name_or_company: string
          original_expiry_date: string | null
          original_key: string | null
          original_order_number: string | null
          payment_method: string | null
          phone: string | null
          plan: string
          purchase_months: string | null
          referral_code: string | null
          total_cost: number
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          activation_date?: string | null
          app_id?: string | null
          automation_module: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          distributor_id?: string | null
          email: string
          id?: string
          lovable_email?: string | null
          make_organization_id?: string | null
          name_or_company: string
          original_expiry_date?: string | null
          original_key?: string | null
          original_order_number?: string | null
          payment_method?: string | null
          phone?: string | null
          plan: string
          purchase_months?: string | null
          referral_code?: string | null
          total_cost: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          activation_date?: string | null
          app_id?: string | null
          automation_module?: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          distributor_id?: string | null
          email?: string
          id?: string
          lovable_email?: string | null
          make_organization_id?: string | null
          name_or_company?: string
          original_expiry_date?: string | null
          original_key?: string | null
          original_order_number?: string | null
          payment_method?: string | null
          phone?: string | null
          plan?: string
          purchase_months?: string | null
          referral_code?: string | null
          total_cost?: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consulting_service_orders: {
        Row: {
          address: string | null
          coaching_mode: string | null
          consulting_plan: string | null
          created_at: string | null
          customer_name_company: string
          email: string
          id: string
          invoice_tax_id: string | null
          invoice_title: string | null
          invoice_type: string | null
          mobile: string
          months: number | null
          notes: string | null
          payment_method: string | null
          preferred_time_slots: string | null
          pricing_tier: string | null
          rag_addon: boolean | null
          referral_code: string | null
          reseller_code: string | null
          service_category: string
          sessions: number | null
          specified_person: string | null
          standard_service_hours: string | null
          total_price: number | null
          training_level: string | null
          unit_price: string | null
          units: number | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          coaching_mode?: string | null
          consulting_plan?: string | null
          created_at?: string | null
          customer_name_company: string
          email: string
          id?: string
          invoice_tax_id?: string | null
          invoice_title?: string | null
          invoice_type?: string | null
          mobile: string
          months?: number | null
          notes?: string | null
          payment_method?: string | null
          preferred_time_slots?: string | null
          pricing_tier?: string | null
          rag_addon?: boolean | null
          referral_code?: string | null
          reseller_code?: string | null
          service_category: string
          sessions?: number | null
          specified_person?: string | null
          standard_service_hours?: string | null
          total_price?: number | null
          training_level?: string | null
          unit_price?: string | null
          units?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          coaching_mode?: string | null
          consulting_plan?: string | null
          created_at?: string | null
          customer_name_company?: string
          email?: string
          id?: string
          invoice_tax_id?: string | null
          invoice_title?: string | null
          invoice_type?: string | null
          mobile?: string
          months?: number | null
          notes?: string | null
          payment_method?: string | null
          preferred_time_slots?: string | null
          pricing_tier?: string | null
          rag_addon?: boolean | null
          referral_code?: string | null
          reseller_code?: string | null
          service_category?: string
          sessions?: number | null
          specified_person?: string | null
          standard_service_hours?: string | null
          total_price?: number | null
          training_level?: string | null
          unit_price?: string | null
          units?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      course_quiz_submissions: {
        Row: {
          answers: Json | null
          completion_date: string
          correct_count: number
          course_date: string
          course_name: string
          created_at: string | null
          email: string
          id: string
          max_score: number
          question_count: number
          student_name: string
          submitted_at: string
          total_score: number
          updated_at: string | null
        }
        Insert: {
          answers?: Json | null
          completion_date: string
          correct_count: number
          course_date: string
          course_name: string
          created_at?: string | null
          email: string
          id?: string
          max_score: number
          question_count: number
          student_name: string
          submitted_at?: string
          total_score: number
          updated_at?: string | null
        }
        Update: {
          answers?: Json | null
          completion_date?: string
          correct_count?: number
          course_date?: string
          course_name?: string
          created_at?: string | null
          email?: string
          id?: string
          max_score?: number
          question_count?: number
          student_name?: string
          submitted_at?: string
          total_score?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      course_retraining_registrations: {
        Row: {
          amount: number
          attendance_days: string
          course_date: string
          course_name: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          invoice_title: string | null
          invoice_type: string | null
          payment_method: string | null
          phone: string
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          attendance_days: string
          course_date: string
          course_name: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          payment_method?: string | null
          phone: string
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          attendance_days?: string
          course_date?: string
          course_name?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          payment_method?: string | null
          phone?: string
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      form_options: {
        Row: {
          created_at: string
          form_id: string
          id: string
          option_key: string
          option_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          option_key: string
          option_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          option_key?: string
          option_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      instructor_payment_applications: {
        Row: {
          activity_category: string
          activity_date1: string
          activity_date2: string | null
          activity_days: string
          address: string
          break_hours: number | null
          created_at: string | null
          email: string
          end_time1: string
          end_time2: string | null
          full_name: string
          id: string
          phone: string
          role: string
          start_time1: string
          start_time2: string | null
          total_hours: number
          updated_at: string | null
        }
        Insert: {
          activity_category: string
          activity_date1: string
          activity_date2?: string | null
          activity_days: string
          address: string
          break_hours?: number | null
          created_at?: string | null
          email: string
          end_time1: string
          end_time2?: string | null
          full_name: string
          id?: string
          phone: string
          role: string
          start_time1: string
          start_time2?: string | null
          total_hours: number
          updated_at?: string | null
        }
        Update: {
          activity_category?: string
          activity_date1?: string
          activity_date2?: string | null
          activity_days?: string
          address?: string
          break_hours?: number | null
          created_at?: string | null
          email?: string
          end_time1?: string
          end_time2?: string | null
          full_name?: string
          id?: string
          phone?: string
          role?: string
          start_time1?: string
          start_time2?: string | null
          total_hours?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_satisfaction_surveys: {
        Row: {
          content_helpfulness: number
          course_date: string
          course_feedback: string | null
          course_name: string
          created_at: string
          email: string
          expectation_met: string
          full_name: string
          future_content_wishes: string | null
          id: string
          learning_pace: number
          other_suggestions: string | null
          ta_assistance: number
          teaching_quality: number
          time_arrangement: number
          updated_at: string
          would_recommend: string
        }
        Insert: {
          content_helpfulness: number
          course_date: string
          course_feedback?: string | null
          course_name: string
          created_at?: string
          email: string
          expectation_met: string
          full_name: string
          future_content_wishes?: string | null
          id?: string
          learning_pace: number
          other_suggestions?: string | null
          ta_assistance: number
          teaching_quality: number
          time_arrangement: number
          updated_at?: string
          would_recommend: string
        }
        Update: {
          content_helpfulness?: number
          course_date?: string
          course_feedback?: string | null
          course_name?: string
          created_at?: string
          email?: string
          expectation_met?: string
          full_name?: string
          future_content_wishes?: string | null
          id?: string
          learning_pace?: number
          other_suggestions?: string | null
          ta_assistance?: number
          teaching_quality?: number
          time_arrangement?: number
          updated_at?: string
          would_recommend?: string
        }
        Relationships: []
      }
      learning_video_confidentiality: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          national_id: string
          phone: string | null
          signature: string | null
          signing_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          national_id: string
          phone?: string | null
          signature?: string | null
          signing_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          national_id?: string
          phone?: string | null
          signature?: string | null
          signing_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          bank_last_5_digits: string
          created_at: string
          email: string
          id: string
          name_or_company: string
          notes: string | null
          order_number: string | null
          payment_amount: number
          payment_date: string
          payment_proof_filename: string | null
          phone: string | null
          product_service: string
          updated_at: string
        }
        Insert: {
          bank_last_5_digits: string
          created_at?: string
          email: string
          id?: string
          name_or_company: string
          notes?: string | null
          order_number?: string | null
          payment_amount: number
          payment_date: string
          payment_proof_filename?: string | null
          phone?: string | null
          product_service: string
          updated_at?: string
        }
        Update: {
          bank_last_5_digits?: string
          created_at?: string
          email?: string
          id?: string
          name_or_company?: string
          notes?: string | null
          order_number?: string | null
          payment_amount?: number
          payment_date?: string
          payment_proof_filename?: string | null
          phone?: string | null
          product_service?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          app_id: string
          app_image_filename: string | null
          app_name: string
          category: string
          created_at: string
          creator: string
          doc_link: string | null
          has_scenario_attachment: boolean
          id: string
          install_link: string
          monthly_price_twd: number
          monthly_price_usd: number
          publish_date: string
          requires_api_token_oauth: boolean
          requires_official_api: boolean
          scenario_attachment_filename: string | null
          updated_at: string
        }
        Insert: {
          app_id: string
          app_image_filename?: string | null
          app_name: string
          category: string
          created_at?: string
          creator: string
          doc_link?: string | null
          has_scenario_attachment?: boolean
          id?: string
          install_link: string
          monthly_price_twd?: number
          monthly_price_usd?: number
          publish_date: string
          requires_api_token_oauth?: boolean
          requires_official_api?: boolean
          scenario_attachment_filename?: string | null
          updated_at?: string
        }
        Update: {
          app_id?: string
          app_image_filename?: string | null
          app_name?: string
          category?: string
          created_at?: string
          creator?: string
          doc_link?: string | null
          has_scenario_attachment?: boolean
          id?: string
          install_link?: string
          monthly_price_twd?: number
          monthly_price_usd?: number
          publish_date?: string
          requires_api_token_oauth?: boolean
          requires_official_api?: boolean
          scenario_attachment_filename?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_contract_submissions: {
        Row: {
          amount_includes_tax: string
          contract_company: string
          contract_type: string
          created_at: string
          estimated_work_days: string
          free_packages: Json | null
          id: string
          paid_packages: Json | null
          party_a_address: string
          party_a_company: string
          party_a_contact: string
          party_a_fax: string | null
          party_a_phone: string
          party_a_signer: string | null
          party_a_tax_id: string
          project_amount: string
          project_content: string
          project_name: string
          smart4a_packages: Json | null
          updated_at: string
        }
        Insert: {
          amount_includes_tax: string
          contract_company: string
          contract_type?: string
          created_at?: string
          estimated_work_days: string
          free_packages?: Json | null
          id?: string
          paid_packages?: Json | null
          party_a_address: string
          party_a_company: string
          party_a_contact: string
          party_a_fax?: string | null
          party_a_phone: string
          party_a_signer?: string | null
          party_a_tax_id: string
          project_amount: string
          project_content: string
          project_name: string
          smart4a_packages?: Json | null
          updated_at?: string
        }
        Update: {
          amount_includes_tax?: string
          contract_company?: string
          contract_type?: string
          created_at?: string
          estimated_work_days?: string
          free_packages?: Json | null
          id?: string
          paid_packages?: Json | null
          party_a_address?: string
          party_a_company?: string
          party_a_contact?: string
          party_a_fax?: string | null
          party_a_phone?: string
          party_a_signer?: string | null
          party_a_tax_id?: string
          project_amount?: string
          project_content?: string
          project_name?: string
          smart4a_packages?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      prompt_mode_changes: {
        Row: {
          created_at: string
          id: string
          line_id: string | null
          prompt_desc: string | null
          prompt_info: string | null
          select_mode: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_id?: string | null
          prompt_desc?: string | null
          prompt_info?: string | null
          select_mode?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line_id?: string | null
          prompt_desc?: string | null
          prompt_info?: string | null
          select_mode?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotation_submissions: {
        Row: {
          company_name: string
          consulting_months: number | null
          consulting_plan: string | null
          contact_person: string
          created_at: string
          customer_address: string | null
          customer_email: string
          customer_phone: string | null
          discount_amount: number | null
          discount_reason: string | null
          id: string
          inquiry_number: string | null
          invoice_title: string | null
          issuer_email: string
          issuer_name: string
          quotation_date: string
          subtotal: number
          tax_id: string | null
          total_amount: number
          training_services: Json | null
          transformation_packages: Json | null
          updated_at: string
        }
        Insert: {
          company_name: string
          consulting_months?: number | null
          consulting_plan?: string | null
          contact_person: string
          created_at?: string
          customer_address?: string | null
          customer_email: string
          customer_phone?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          inquiry_number?: string | null
          invoice_title?: string | null
          issuer_email: string
          issuer_name: string
          quotation_date: string
          subtotal?: number
          tax_id?: string | null
          total_amount?: number
          training_services?: Json | null
          transformation_packages?: Json | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          consulting_months?: number | null
          consulting_plan?: string | null
          contact_person?: string
          created_at?: string
          customer_address?: string | null
          customer_email?: string
          customer_phone?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          inquiry_number?: string | null
          invoice_title?: string | null
          issuer_email?: string
          issuer_name?: string
          quotation_date?: string
          subtotal?: number
          tax_id?: string | null
          total_amount?: number
          training_services?: Json | null
          transformation_packages?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      revenue_sharing_recipients: {
        Row: {
          account_number: string
          bank_code: string
          bank_name: string
          branch_code: string
          branch_name: string
          company_address: string | null
          company_contact_name: string | null
          company_name: string | null
          company_tax_id: string | null
          created_at: string | null
          email: string
          id: string
          phone: string
          recipient_address: string | null
          recipient_id_number: string | null
          recipient_name: string | null
          recipient_type: string
          updated_at: string | null
        }
        Insert: {
          account_number: string
          bank_code: string
          bank_name: string
          branch_code: string
          branch_name: string
          company_address?: string | null
          company_contact_name?: string | null
          company_name?: string | null
          company_tax_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          phone: string
          recipient_address?: string | null
          recipient_id_number?: string | null
          recipient_name?: string | null
          recipient_type: string
          updated_at?: string | null
        }
        Update: {
          account_number?: string
          bank_code?: string
          bank_name?: string
          branch_code?: string
          branch_name?: string
          company_address?: string | null
          company_contact_name?: string | null
          company_name?: string | null
          company_tax_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          phone?: string
          recipient_address?: string | null
          recipient_id_number?: string | null
          recipient_name?: string | null
          recipient_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_inquiry_submissions: {
        Row: {
          company_address: string | null
          company_name: string
          consulting_designated_name: string | null
          consulting_months: number | null
          consulting_plan: string | null
          consulting_rag: string | null
          consulting_type: string | null
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at: string
          custom_description: string | null
          estimated_amount: number | null
          id: string
          invoice_title: string | null
          notes: string | null
          tax_id: string | null
          training_category: string | null
          training_designated_name: string | null
          training_option: string | null
          training_sessions: number | null
          transformation_package: string | null
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          company_name: string
          consulting_designated_name?: string | null
          consulting_months?: number | null
          consulting_plan?: string | null
          consulting_rag?: string | null
          consulting_type?: string | null
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at?: string
          custom_description?: string | null
          estimated_amount?: number | null
          id?: string
          invoice_title?: string | null
          notes?: string | null
          tax_id?: string | null
          training_category?: string | null
          training_designated_name?: string | null
          training_option?: string | null
          training_sessions?: number | null
          transformation_package?: string | null
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          company_name?: string
          consulting_designated_name?: string | null
          consulting_months?: number | null
          consulting_plan?: string | null
          consulting_rag?: string | null
          consulting_type?: string | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          custom_description?: string | null
          estimated_amount?: number | null
          id?: string
          invoice_title?: string | null
          notes?: string | null
          tax_id?: string | null
          training_category?: string | null
          training_designated_name?: string | null
          training_option?: string | null
          training_sessions?: number | null
          transformation_package?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      smart4a_member_registrations: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          line_id: string | null
          make_organization_id: string | null
          phone: string
          postal_code: string | null
          referral_code: string | null
          submission_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          line_id?: string | null
          make_organization_id?: string | null
          phone: string
          postal_code?: string | null
          referral_code?: string | null
          submission_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          line_id?: string | null
          make_organization_id?: string | null
          phone?: string
          postal_code?: string | null
          referral_code?: string | null
          submission_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_club_registrations: {
        Row: {
          amount: number
          course_date: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          invoice_title: string | null
          invoice_type: string | null
          is_student: boolean
          payment_method: string | null
          phone: string
          points_status: string | null
          student_id: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          course_date: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          is_student: boolean
          payment_method?: string | null
          phone: string
          points_status?: string | null
          student_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          course_date?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          is_student?: boolean
          payment_method?: string | null
          phone?: string
          points_status?: string | null
          student_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_product_claims: {
        Row: {
          claim_items: Json | null
          created_at: string | null
          email: string
          id: string
          make_organization_id: string
          name_or_company: string
          packages: string | null
          student_id: string | null
          template: string | null
          updated_at: string | null
        }
        Insert: {
          claim_items?: Json | null
          created_at?: string | null
          email: string
          id?: string
          make_organization_id: string
          name_or_company: string
          packages?: string | null
          student_id?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Update: {
          claim_items?: Json | null
          created_at?: string | null
          email?: string
          id?: string
          make_organization_id?: string
          name_or_company?: string
          packages?: string | null
          student_id?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_store_orders: {
        Row: {
          address: string | null
          created_at: string | null
          currency: string | null
          dealer_code: string | null
          email: string
          id: string
          invoice_title: string | null
          invoice_type: string | null
          name_or_company: string
          payment_method: string | null
          phone: string | null
          postal_code: string | null
          price: number
          referral_code: string | null
          tax_id: string | null
          template: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          dealer_code?: string | null
          email: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          name_or_company: string
          payment_method?: string | null
          phone?: string | null
          postal_code?: string | null
          price?: number
          referral_code?: string | null
          tax_id?: string | null
          template: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          dealer_code?: string | null
          email?: string
          id?: string
          invoice_title?: string | null
          invoice_type?: string | null
          name_or_company?: string
          payment_method?: string | null
          phone?: string | null
          postal_code?: string | null
          price?: number
          referral_code?: string | null
          tax_id?: string | null
          template?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_store_orders_en: {
        Row: {
          country: string | null
          created_at: string | null
          currency: string | null
          dealer_code: string | null
          email: string
          id: string
          name_or_company: string
          payment_method: string | null
          phone: string | null
          price: number
          referral_code: string | null
          template: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          dealer_code?: string | null
          email: string
          id?: string
          name_or_company: string
          payment_method?: string | null
          phone?: string | null
          price?: number
          referral_code?: string | null
          template: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          dealer_code?: string | null
          email?: string
          id?: string
          name_or_company?: string
          payment_method?: string | null
          phone?: string | null
          price?: number
          referral_code?: string | null
          template?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tuesday_meetup_registrations: {
        Row: {
          created_at: string | null
          email: string
          event_date: string
          full_name: string
          id: string
          order_number: string | null
          phone: string
          purposes: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_date: string
          full_name: string
          id?: string
          order_number?: string | null
          phone: string
          purposes?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_date?: string
          full_name?: string
          id?: string
          order_number?: string | null
          phone?: string
          purposes?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      venue_rental_applications: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          discount_hours: number | null
          end_time1: string
          end_time2: string | null
          event_theme: string
          id: string
          invoice_tax_id: string | null
          invoice_title: string | null
          invoice_type: string | null
          rental_date1: string
          rental_date2: string | null
          rental_days: string
          start_time1: string
          start_time2: string | null
          total_amount: number
          total_hours: number
          updated_at: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          discount_hours?: number | null
          end_time1: string
          end_time2?: string | null
          event_theme: string
          id?: string
          invoice_tax_id?: string | null
          invoice_title?: string | null
          invoice_type?: string | null
          rental_date1: string
          rental_date2?: string | null
          rental_days: string
          start_time1: string
          start_time2?: string | null
          total_amount: number
          total_hours: number
          updated_at?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          discount_hours?: number | null
          end_time1?: string
          end_time2?: string | null
          event_theme?: string
          id?: string
          invoice_tax_id?: string | null
          invoice_title?: string | null
          invoice_type?: string | null
          rental_date1?: string
          rental_date2?: string | null
          rental_days?: string
          start_time1?: string
          start_time2?: string | null
          total_amount?: number
          total_hours?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
