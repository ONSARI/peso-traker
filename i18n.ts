import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Directamente incrusta el JSON de traducción en el código
// para evitar cualquier problema con la resolución de módulos de archivos.

const translationEN = {
  "auth": {
    "loading": "Loading...",
    "verifyTitle": "Verify Your Phone",
    "verifyInstruction": "Enter the 6-digit code we sent to {{phone}}.",
    "verifyButton": "Verify and Continue",
    "verifyingButton": "Verifying...",
    "backToSignup": "Back to registration",
    "signupTitle": "Create Your Account",
    "signupInstruction": "Complete your details to get started.",
    "namePlaceholder": "Your name",
    "nameRequiredError": "Please enter your name.",
    "dobLabel": "Date of birth",
    "heightUnitLabel": "Height Unit",
    "cm": "cm",
    "ft": "ft",
    "heightPlaceholderCm": "Your height in cm (e.g., 175)",
    "ftPlaceholder": "ft",
    "inPlaceholder": "in",
    "invalidHeightError": "Please enter a valid height.",
    "passwordPlaceholder": "Your password",
    "phonePlaceholder": "Phone number",
    "invalidPhoneError": "Please select a country and enter a valid phone number.",
    "searchCountryPlaceholder": "Search country...",
    "phoneVerificationNotice": "You will receive an SMS for verification.",
    "signupButton": "Sign Up",
    "signingUpButton": "Signing up...",
    "switchToLogin": "Already have an account? Log in",
    "loginTitle": "Welcome Back!",
    "loginInstruction": "Log in to your account to continue.",
    "loginButton": "Log In",
    "loggingInButton": "Sending code...",
    "switchToSignup": "Don't have an account? Sign up",
    "otpSuccessMessage": "Verification code sent! Check your phone.",
    "profileCreationError": "Verification successful! But we couldn't save your profile: {{message}}. Please try to register again.",
    "forgotPasswordLink": "Forgot your password?",
    "forgotPasswordTitle": "Reset Password",
    "forgotPasswordInstruction": "Enter your phone number and we'll send you a code to reset your password.",
    "sendResetCodeButton": "Send Reset Code",
    "sendingCodeButton": "Sending...",
    "updatePasswordTitle": "Update Your Password",
    "updatePasswordInstruction": "We sent a code to {{phone}}. Enter it below along with your new password.",
    "otpPlaceholder": "Verification Code",
    "newPasswordPlaceholder": "New Password",
    "updatePasswordButton": "Update Password",
    "updatingPasswordButton": "Updating...",
    "passwordUpdateSuccess": "Your password has been updated successfully! You can now log in with your new password.",
    "resetCodeSuccessMessage": "A password reset code has been sent to your phone.",
    "backToLogin": "Back to Login"
  },
  "header": {
    "greeting": "Hi, {{name}}",
    "editName": "Edit name",
    "logout": "Log Out"
  },
  "dashboard": {
    "weightTrend": "Weight Trend",
    "bmiTrend": "BMI Trend",
    "profileFetchError": "Could not load your profile. Please check the information below to resolve the issue.",
    "weightsFetchError": "Could not load your weight entries. Please check the information below to resolve the issue.",
    "syncErrorTitle": "Synchronization Error",
    "syncErrorBody": "We've detected an active session but could not find your profile. This might be a temporary error.",
    "dataErrorTitle": "Error Loading Data",
    "rlsErrorTitle": "Database Permissions Required",
    "rlsErrorBody": "This error occurs because the application does not have permission to read or write your data. This must be fixed in your Supabase database settings.",
    "rlsSolution": {
      "yourProjectRef": "your-project-ref",
      "step1": "<1>Step 1:</1> Copy the complete SQL script below. It will safely remove any old, conflicting policies and create the correct ones.",
      "copy": "Copy",
      "copied": "Copied!",
      "step2": "<1>Step 2:</1> Open the Supabase SQL Editor for your project.",
      "step3": "Step 3: Paste the entire script into the editor and click 'RUN'.",
      "step4": "Step 4: Once it finishes, come back here, log out, and log back in. The problem will be solved!",
      "fullSQLScript": "-- This script resets and creates the necessary security policies.\n-- It is safe to run multiple times.\n\n-- 1. Enable RLS on tables\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Clean up old policies on 'profiles' table\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Los usuarios pueden actualizar su propio perfil\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Create correct policies for 'profiles' table\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Clean up old policies on 'weights' table\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Create correct policies for 'weights' table\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Create policies for 'measurements' table\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Database Schema Error",
      "body": "The app failed because your 'profiles' table is missing some columns needed for goal-setting. This is a simple configuration issue.",
      "script": "-- This script adds the missing goal weight columns to your 'profiles' table.\n-- This is necessary for the app's goal-setting features to work.\n-- It's safe to run this multiple times.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8;"
    },
    "tryAgainButton": "Log Out and Try Again",
    "profileUpdateError": "Failed to save profile. This can be caused by database permissions (RLS) or a schema mismatch (e.g., incorrect table/column names).",
    "weightAddError": "Failed to add weight entry. This can be caused by database permissions (RLS) or a schema mismatch.",
    "weightDeleteError": "Failed to delete weight entry. This can be caused by database permissions (RLS) or a schema mismatch.",
    "measurementAddError": "Failed to add measurement entry.",
    "measurementDeleteError": "Failed to delete measurement entry.",
    "errorDetails": "Details: {{details}}"
  },
  "bmiCard": {
    "title": "Your Status",
    "lastWeight": "Last Weight",
    "height": "Height",
    "bmiLabel": "Your BMI",
    "notAvailable": "N/A",
    "underweight": "Underweight",
    "normal": "Normal weight",
    "overweight": "Overweight",
    "obesity1": "Obesity Grade I",
    "obesity2": "Obesity Grade II",
    "obesity3": "Obesity Grade III",
    "improvementNeeded": "Lose <1>{{weight}}</1> to reach the <3>{{category}}</3> category.",
    "goals": {
      "title": "Your Goals",
      "goal1": "First Goal",
      "goal2": "Second Goal",
      "finalGoal": "Final Goal",
      "set": "Set",
      "edit": "Edit",
      "allGoalsReached": "All goals achieved! Congratulations! 🥳",
      "toGo": "to reach your next goal"
    },
    "goalProgress": {
      "title": "Goal Progress",
      "progressComplete": "{{percentage}}% Complete",
      "startLabel": "Start",
      "goalLabel": "Goal"
    },
    "progress": {
      "title": "Progress",
      "allTime": "Since Beginning",
      "sevenDays": "Last 7 Days",
      "thirtyDays": "Last 30 Days",
      "oneYear": "Last Year",
      "weightChange": "Weight Change",
      "bmiChange": "BMI Change (%)"
    },
    "units": {
      "title": "Unit Preferences",
      "weight": "Weight",
      "height": "Height",
      "measurements": "Measurements",
      "kg": "kg",
      "lbs": "lbs",
      "cm": "cm",
      "ft": "ft",
      "in": "in"
    }
  },
  "weightForm": {
    "title": "Add Weight Entry",
    "dateLabel": "Date",
    "weightLabel": "Weight ({{unit}})",
    "weightPlaceholder": "e.g., 75.5",
    "saveButton": "Save Weight",
    "validationError": "Please enter a valid weight and select a date."
  },
    "measurementForm": {
    "title": "Log Measurements",
    "dateLabel": "Date",
    "waistLabel": "Waist ({{unit}})",
    "hipsLabel": "Hips ({{unit}})",
    "chestLabel": "Chest ({{unit}})",
    "rightArmLabel": "Right Bicep ({{unit}})",
    "leftArmLabel": "Left Bicep ({{unit}})",
    "rightLegLabel": "Right Quad ({{unit}})",
    "leftLegLabel": "Left Quad ({{unit}})",
    "saveButton": "Save Measurements"
  },
  "history": {
    "title": "Weight History",
    "noEntries": "No weight entries yet. Add one to get started!",
    "dateHeader": "Date",
    "weightHeader": "Weight ({{unit}})",
    "actionsHeader": "Actions",
    "deleteLabel": "Delete entry"
  },
  "measurementHistory": {
    "title": "Measurement History",
    "noEntries": "No measurements logged yet.",
    "dateHeader": "Date",
    "waistHeader": "Waist",
    "hipsHeader": "Hips",
    "chestHeader": "Chest",
    "rightArmHeader": "R. Bicep",
    "leftArmHeader": "L. Bicep",
    "rightLegHeader": "R. Quad",
    "leftLegHeader": "L. Quad",
    "actionsHeader": "Actions"
  },
  "charts": {
    "noDataWeight": "Enter at least two weight entries to see your progress chart.",
    "noDataBmi": "Enter at least two weight entries to see your BMI trend chart.",
    "noDataMeasurements": "Log at least two sets of measurements to see your trend chart.",
    "weightLabel": "Weight",
    "bmiLabel": "BMI",
    "yAxisLabelWeight": "Weight ({{unit}})",
    "yAxisLabelBmi": "BMI",
    "measurementTrend": "Measurement Trend",
    "waist": "Waist",
    "hips": "Hips",
    "chest": "Chest",
    "right_arm": "Right Bicep",
    "left_arm": "Left Bicep",
    "right_leg": "Right Quad",
    "left_leg": "Left Quad"
  },
  "achievements": {
    "title": "Achievements",
    "modalTitle": "New Achievement Unlocked!",
    "modalClose": "Awesome!",
    "firstStep": {
      "title": "First Step",
      "description": "You've recorded your first weight. The journey begins!"
    },
    "fivePercent": {
      "title": "Making Progress",
      "description": "You've lost 5% of your starting body weight. Keep it up!"
    },
    "tenPercent": {
      "title": "On a Roll!",
      "description": "You've lost 10% of your starting body weight. Incredible!"
    },
    "bmiImproved": {
      "title": "Healthier You",
      "description": "You've improved your BMI category. A major milestone!"
    },
    "goalReached": {
      "title": "Goal Smasher!",
      "description": "You've reached your final target weight. Congratulations!"
    }
  },
  "aiCoach": {
    "title": "Zen Assistant Analysis",
    "getAnalysisButton": "Get My Analysis",
    "loading": "Zen is analyzing your progress...",
    "error": "Sorry, I couldn't complete the analysis right now. Please try again later.",
    "intro": "Here's a quick look at your progress:"
  },
  "avatarCard": {
    "title": "Your Zen Avatar",
    "noData": "Add some body measurements to see your avatar.",
    "showingDataFor": "Showing data from {{date}}"
  }
};

const translationES = {
 "auth": {
    "loading": "Cargando...",
    "verifyTitle": "Verifica tu Teléfono",
    "verifyInstruction": "Introduce el código de 6 dígitos que te hemos enviado a {{phone}}.",
    "verifyButton": "Verificar y Entrar",
    "verifyingButton": "Verificando...",
    "backToSignup": "Volver al registro",
    "signupTitle": "Crea tu Cuenta",
    "signupInstruction": "Completa tus datos para empezar.",
    "namePlaceholder": "Tu nombre",
    "nameRequiredError": "Por favor, introduce tu nombre.",
    "dobLabel": "Fecha de nacimiento",
    "heightUnitLabel": "Unidad de Altura",
    "cm": "cm",
    "ft": "ft",
    "heightPlaceholderCm": "Tu altura en cm (ej: 175)",
    "ftPlaceholder": "pies",
    "inPlaceholder": "pulg",
    "invalidHeightError": "Por favor, introduce una altura válida.",
    "passwordPlaceholder": "Tu contraseña",
    "phonePlaceholder": "Número de teléfono",
    "invalidPhoneError": "Por favor, selecciona un país e introduce un número de teléfono válido.",
    "searchCountryPlaceholder": "Buscar país...",
    "phoneVerificationNotice": "Recibirás un SMS de verificación.",
    "signupButton": "Registrarse",
    "signingUpButton": "Registrando...",
    "switchToLogin": "¿Ya tienes una cuenta? Inicia sesión",
    "loginTitle": "¡Bienvenido de Vuelta!",
    "loginInstruction": "Ingresa a tu cuenta para continuar.",
    "loginButton": "Iniciar Sesión",
    "loggingInButton": "Enviando código...",
    "switchToSignup": "¿No tienes cuenta? Regístrate",
    "otpSuccessMessage": "¡Código de verificación enviado! Revisa tu teléfono.",
    "profileCreationError": "¡Verificación exitosa! Pero no pudimos guardar tu perfil: {{message}}. Por favor, intenta registrarte de nuevo.",
    "forgotPasswordLink": "¿Olvidaste tu contraseña?",
    "forgotPasswordTitle": "Restablecer Contraseña",
    "forgotPasswordInstruction": "Introduce tu número de teléfono y te enviaremos un código para restablecer tu contraseña.",
    "sendResetCodeButton": "Enviar Código",
    "sendingCodeButton": "Enviando...",
    "updatePasswordTitle": "Actualiza Tu Contraseña",
    "updatePasswordInstruction": "Hemos enviado un código a {{phone}}. Introdúcelo abajo junto con tu nueva contraseña.",
    "otpPlaceholder": "Código de Verificación",
    "newPasswordPlaceholder": "Nueva Contraseña",
    "updatePasswordButton": "Actualizar Contraseña",
    "updatingPasswordButton": "Actualizando...",
    "passwordUpdateSuccess": "¡Tu contraseña se ha actualizado correctamente! Ahora puedes iniciar sesión con tu nueva contraseña.",
    "resetCodeSuccessMessage": "Se ha enviado un código de restablecimiento de contraseña a tu teléfono.",
    "backToLogin": "Volver al inicio de sesión"
  },
  "header": {
    "greeting": "Hola, {{name}}",
    "editName": "Editar nombre",
    "logout": "Cerrar Sesión"
  },
  "dashboard": {
    "weightTrend": "Tendencia de Peso",
    "bmiTrend": "Tendencia de IMC",
    "profileFetchError": "No se pudo cargar tu perfil. Revisa la información de abajo para solucionar el problema.",
    "weightsFetchError": "No se pudieron cargar tus registros de peso. Revisa la información de abajo para solucionar el problema.",
    "syncErrorTitle": "Error de Sincronización",
    "syncErrorBody": "Hemos detectado una sesión activa pero no hemos podido encontrar tu perfil. Esto puede ser un error temporal.",
    "dataErrorTitle": "Error al Cargar Datos",
    "rlsErrorTitle": "Se Requieren Permisos de Base de Datos",
    "rlsErrorBody": "Este error ocurre porque la aplicación no tiene permiso para leer o escribir tus datos. Esto debe solucionarse en la configuración de tu base de datos de Supabase.",
    "rlsSolution": {
      "yourProjectRef": "tu-ref-de-proyecto",
      "step1": "<1>Paso 1:</1> Copia el script SQL completo de abajo. Eliminará de forma segura cualquier política antigua y conflictiva y creará las correctas.",
      "copy": "Copiar",
      "copied": "¡Copiado!",
      "step2": "<1>Paso 2:</1> Abre el Editor de SQL de Supabase para tu proyecto.",
      "step3": "Paso 3: Pega el script completo en el editor y haz clic en 'RUN'.",
      "step4": "Paso 4: Cuando termine, vuelve aquí, cierra sesión y vuelve a iniciar sesión. ¡El problema estará resuelto!",
      "fullSQLScript": "-- Este script reinicia y crea las políticas de seguridad necesarias.\n-- Es seguro ejecutarlo varias veces.\n\n-- 1. Habilitar RLS en las tablas\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Limpiar políticas antiguas en la tabla 'profiles'\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Los usuarios pueden actualizar su propio perfil\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Crear políticas correctas para la tabla 'profiles'\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Limpiar políticas antiguas en la tabla 'weights'\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Crear políticas correctas para la tabla 'weights'\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Crear políticas para la tabla 'measurements'\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Error de Esquema de la Base de Datos",
      "body": "La aplicación falló porque a tu tabla 'profiles' le faltan algunas columnas necesarias para establecer objetivos. Este es un simple problema de configuración.",
      "script": "-- Este script añade las columnas de peso objetivo que faltan a tu tabla 'profiles'.\n-- Esto es necesario para que funcionen las características de establecimiento de objetivos de la aplicación.\n-- Es seguro ejecutarlo varias veces.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8;"
    },
    "tryAgainButton": "Cerrar Sesión e Intentar de Nuevo",
    "profileUpdateError": "No se pudieron guardar los cambios del perfil. Esto puede ser por permisos (RLS) o un desajuste del esquema (ej: nombres de tabla/columna incorrectos).",
    "weightAddError": "No se pudo añadir el registro de peso. Esto puede ser por permisos (RLS) o un desajuste del esquema.",
    "weightDeleteError": "No se pudo eliminar el registro de peso. Esto puede ser por permisos (RLS) o un desajuste del esquema.",
    "measurementAddError": "No se pudo añadir el registro de medidas.",
    "measurementDeleteError": "No se pudo eliminar el registro de medidas.",
    "errorDetails": "Detalles: {{details}}"
  },
  "bmiCard": {
    "title": "Tu Estado",
    "lastWeight": "Último Peso",
    "height": "Altura",
    "bmiLabel": "Tu IMC",
    "notAvailable": "N/A",
    "underweight": "Bajo peso",
    "normal": "Peso normal",
    "overweight": "Sobrepeso",
    "obesity1": "Obesidad Grado I",
    "obesity2": "Obesidad Grado II",
    "obesity3": "Obesidad Grado III",
    "improvementNeeded": "Pierde <1>{{weight}}</1> para alcanzar la categoría de <3>{{category}}</3>.",
    "goals": {
      "title": "Tus Objetivos",
      "goal1": "Primer Objetivo",
      "goal2": "Segundo Objetivo",
      "finalGoal": "Meta Final",
      "set": "Fijar",
      "edit": "Editar",
      "allGoalsReached": "¡Todos los objetivos cumplidos! ¡Felicidades! 🥳",
      "toGo": "para alcanzar tu próximo objetivo"
    },
    "goalProgress": {
      "title": "Progreso Hacia la Meta",
      "progressComplete": "{{percentage}}% Completado",
      "startLabel": "Inicio",
      "goalLabel": "Meta"
    },
    "progress": {
      "title": "Progreso",
      "allTime": "Desde el inicio",
      "sevenDays": "Últimos 7 días",
      "thirtyDays": "Últimos 30 días",
      "oneYear": "Último año",
      "weightChange": "Cambio de Peso",
      "bmiChange": "Cambio IMC (%)"
    },
    "units": {
      "title": "Preferencias de Unidades",
      "weight": "Peso",
      "height": "Altura",
      "measurements": "Medidas",
      "kg": "kg",
      "lbs": "lbs",
      "cm": "cm",
      "ft": "ft",
      "in": "pulg"
    }
  },
  "weightForm": {
    "title": "Añadir Registro de Peso",
    "dateLabel": "Fecha",
    "weightLabel": "Peso ({{unit}})",
    "weightPlaceholder": "ej: 75.5",
    "saveButton": "Guardar Peso",
    "validationError": "Por favor, introduce un peso válido y selecciona una fecha."
  },
   "measurementForm": {
    "title": "Registrar Medidas",
    "dateLabel": "Fecha",
    "waistLabel": "Cintura ({{unit}})",
    "hipsLabel": "Cadera ({{unit}})",
    "chestLabel": "Pecho ({{unit}})",
    "rightArmLabel": "Bíceps Derecho ({{unit}})",
    "leftArmLabel": "Bíceps Izquierdo ({{unit}})",
    "rightLegLabel": "Cuádriceps Derecho ({{unit}})",
    "leftLegLabel": "Cuádriceps Izquierdo ({{unit}})",
    "saveButton": "Guardar Medidas"
  },
  "history": {
    "title": "Historial de Peso",
    "noEntries": "Aún no hay registros de peso. ¡Añade uno para empezar!",
    "dateHeader": "Fecha",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Acciones",
    "deleteLabel": "Eliminar registro"
  },
  "measurementHistory": {
    "title": "Historial de Medidas",
    "noEntries": "Aún no hay medidas registradas.",
    "dateHeader": "Fecha",
    "waistHeader": "Cintura",
    "hipsHeader": "Cadera",
    "chestHeader": "Pecho",
    "rightArmHeader": "Bícep D.",
    "leftArmHeader": "Bícep I.",
    "rightLegHeader": "Cuád. D.",
    "leftLegHeader": "Cuád. I.",
    "actionsHeader": "Acciones"
  },
  "charts": {
    "noDataWeight": "Introduce al menos dos registros de peso para ver tu gráfico de progreso.",
    "noDataBmi": "Introduce al menos dos registros de peso para ver tu gráfico de tendencia de IMC.",
    "noDataMeasurements": "Registra al menos dos conjuntos de medidas para ver tu gráfico de tendencias.",
    "weightLabel": "Peso",
    "bmiLabel": "IMC",
    "yAxisLabelWeight": "Peso ({{unit}})",
    "yAxisLabelBmi": "IMC",
    "measurementTrend": "Tendencia de Medidas",
    "waist": "Cintura",
    "hips": "Cadera",
    "chest": "Pecho",
    "right_arm": "Bíceps Derecho",
    "left_arm": "Bíceps Izquierdo",
    "right_leg": "Cuádriceps Derecho",
    "left_leg": "Cuádriceps Izquierdo"
  },
  "achievements": {
    "title": "Logros",
    "modalTitle": "¡Nuevo Logro Desbloqueado!",
    "modalClose": "¡Genial!",
    "firstStep": {
      "title": "Primer Paso",
      "description": "Has registrado tu primer peso. ¡El viaje comienza!"
    },
    "fivePercent": {
      "title": "Haciendo Progreso",
      "description": "Has perdido el 5% de tu peso corporal inicial. ¡Sigue así!"
    },
    "tenPercent": {
      "title": "¡En Racha!",
      "description": "Has perdido el 10% de tu peso corporal inicial. ¡Increíble!"
    },
    "bmiImproved": {
      "title": "Más Saludable",
      "description": "Has mejorado tu categoría de IMC. ¡Un hito importante!"
    },
    "goalReached": {
      "title": "¡Meta Cumplida!",
      "description": "Has alcanzado tu meta final de peso. ¡Felicidades!"
    }
  },
    "aiCoach": {
    "title": "Análisis del Asistente Zen",
    "getAnalysisButton": "Obtener mi Análisis",
    "loading": "Zen está analizando tu progreso...",
    "error": "Lo siento, no pude completar el análisis en este momento. Por favor, inténtalo de nuevo más tarde.",
    "intro": "Aquí tienes un vistazo rápido a tu progreso:"
  },
  "avatarCard": {
    "title": "Tu Avatar Zen",
    "noData": "Añade algunas medidas corporales para ver tu avatar.",
    "showingDataFor": "Mostrando datos de {{date}}"
  }
};

const translationPT = {
  "auth": {
    "loading": "Carregando...",
    "verifyTitle": "Verifique seu Telefone",
    "verifyInstruction": "Digite o código de 6 dígitos que enviamos para {{phone}}.",
    "verifyButton": "Verificar e Entrar",
    "verifyingButton": "Verificando...",
    "backToSignup": "Voltar ao registo",
    "signupTitle": "Crie a sua Conta",
    "signupInstruction": "Complete os seus dados para começar.",
    "namePlaceholder": "Seu nome",
    "nameRequiredError": "Por favor, insira o seu nome.",
    "dobLabel": "Data de nascimento",
    "heightUnitLabel": "Unidade de Altura",
    "cm": "cm",
    "ft": "pés",
    "heightPlaceholderCm": "Sua altura em cm (ex: 175)",
    "ftPlaceholder": "pés",
    "inPlaceholder": "pol",
    "invalidHeightError": "Por favor, insira uma altura válida.",
    "passwordPlaceholder": "Sua senha",
    "phonePlaceholder": "Número de telefone",
    "invalidPhoneError": "Por favor, selecione um país e insira um número de telefone válido.",
    "searchCountryPlaceholder": "Procurar país...",
    "phoneVerificationNotice": "Você receberá um SMS de verificação.",
    "signupButton": "Registrar",
    "signingUpButton": "Registrando...",
    "switchToLogin": "Já tem uma conta? Inicie sessão",
    "loginTitle": "Bem-vindo de Volta!",
    "loginInstruction": "Aceda à sua conta para continuar.",
    "loginButton": "Iniciar Sessão",
    "loggingInButton": "Enviando código...",
    "switchToSignup": "Não tem conta? Registre-se",
    "otpSuccessMessage": "Código de verificação enviado! Verifique seu telefone.",
    "profileCreationError": "Verificação bem-sucedida! Mas não foi possível guardar o seu perfil: {{message}}. Por favor, tente registrar-se novamente.",
    "forgotPasswordLink": "Esqueceu a sua senha?",
    "forgotPasswordTitle": "Redefinir Senha",
    "forgotPasswordInstruction": "Insira o seu número de telefone e enviaremos um código para redefinir a sua senha.",
    "sendResetCodeButton": "Enviar Código",
    "sendingCodeButton": "Enviando...",
    "updatePasswordTitle": "Atualize a Sua Senha",
    "updatePasswordInstruction": "Enviamos um código para {{phone}}. Insira-o abaixo juntamente com a sua nova senha.",
    "otpPlaceholder": "Código de Verificação",
    "newPasswordPlaceholder": "Nova Senha",
    "updatePasswordButton": "Atualizar Senha",
    "updatingPasswordButton": "Atualizando...",
    "passwordUpdateSuccess": "A sua senha foi atualizada com sucesso! Agora pode iniciar sessão com a sua nova senha.",
    "resetCodeSuccessMessage": "Foi enviado um código de redefinição de senha para o seu telefone.",
    "backToLogin": "Voltar ao início de sessão"
  },
  "header": {
    "greeting": "Olá, {{name}}",
    "editName": "Editar nome",
    "logout": "Sair"
  },
  "dashboard": {
    "weightTrend": "Tendência de Peso",
    "bmiTrend": "Tendência de IMC",
    "profileFetchError": "Não foi possível carregar o seu perfil. Verifique as informações abaixo para resolver o problema.",
    "weightsFetchError": "Não foi possível carregar os seus registos de peso. Verifique as informações abaixo para resolver o problema.",
    "syncErrorTitle": "Erro de Sincronização",
    "syncErrorBody": "Detectamos uma sessão ativa, mas não conseguimos encontrar o seu perfil. Isto pode ser um erro temporário.",
    "dataErrorTitle": "Erro ao Carregar Dados",
    "rlsErrorTitle": "Permissões de Base de Dados Necessárias",
    "rlsErrorBody": "Este erro ocorre porque a aplicação não tem permissão para ler ou escrever os seus dados. Isto deve ser corrigido nas configurações da sua base de dados Supabase.",
    "rlsSolution": {
      "yourProjectRef": "sua-ref-de-projeto",
      "step1": "<1>Passo 1:</1> Copie o script SQL completo abaixo. Ele removerá com segurança quaisquer políticas antigas e conflituosas e criará as corretas.",
      "copy": "Copiar",
      "copied": "Copiado!",
      "step2": "<1>Passo 2:</1> Abra o Editor de SQL do Supabase para o seu projeto.",
      "step3": "Passo 3: Cole o script inteiro no editor e clique em 'RUN'.",
      "step4": "Passo 4: Quando terminar, volte aqui, saia da sessão e inicie sessão novamente. O problema estará resolvido!",
      "fullSQLScript": "-- Este script redefine e cria as políticas de segurança necessárias.\n-- É seguro executá-lo várias vezes.\n\n-- 1. Ativar RLS nas tabelas\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Limpar políticas antigas na tabela 'profiles'\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Los usuarios pueden actualizar su propio perfil\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Criar políticas corretas para a tabela 'profiles'\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Limpar políticas antigas na tabela 'weights'\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Criar políticas corretas para a tabela 'weights'\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Criar políticas para a tabela 'measurements'\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Erro de Esquema da Base de Dados",
      "body": "A aplicação falhou porque a sua tabela 'profiles' não tem algumas colunas necessárias para a definição de metas. Este é um problema de configuração simples.",
      "script": "-- Este script adiciona as colunas de peso-alvo em falta à sua tabela 'profiles'.\n-- Isto é necessário para que as funcionalidades de definição de metas da aplicação funcionem.\n-- É seguro executá-lo várias vezes.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8;"
    },
    "tryAgainButton": "Sair e Tentar Novamente",
    "profileUpdateError": "Não foi possível salvar as alterações do perfil. Pode ser causado por permissões (RLS) ou incompatibilidade de esquema (ex: nomes de tabela/coluna incorretos).",
    "weightAddError": "Não foi possível adicionar o registo de peso. Pode ser causado por permissões (RLS) ou incompatibilidade de esquema.",
    "weightDeleteError": "Não foi possível excluir o registo de peso. Pode ser causado por permissões (RLS) ou incompatibilidade de esquema.",
    "measurementAddError": "Falha ao adicionar registo de medição.",
    "measurementDeleteError": "Falha ao eliminar registo de medição.",
    "errorDetails": "Detalhes: {{details}}"
  },
  "bmiCard": {
    "title": "Seu Status",
    "lastWeight": "Último Peso",
    "height": "Altura",
    "bmiLabel": "Seu IMC",
    "notAvailable": "N/A",
    "underweight": "Abaixo do peso",
    "normal": "Peso normal",
    "overweight": "Sobrepeso",
    "obesity1": "Obesidade Grau I",
    "obesity2": "Obesidade Grau II",
    "obesity3": "Obesidade Grau III",
    "improvementNeeded": "Perca <1>{{weight}}</1> para alcançar a categoria de <3>{{category}}</3>.",
    "goals": {
      "title": "Seus Objetivos",
      "goal1": "Primeiro Objetivo",
      "goal2": "Segundo Objetivo",
      "finalGoal": "Meta Final",
      "set": "Definir",
      "edit": "Editar",
      "allGoalsReached": "Todos os objetivos cumpridos! Parabéns! 🥳",
      "toGo": "para alcançar o seu próximo objetivo"
    },
    "goalProgress": {
      "title": "Progresso Para a Meta",
      "progressComplete": "{{percentage}}% Concluído",
      "startLabel": "Início",
      "goalLabel": "Meta"
    },
    "progress": {
      "title": "Progresso",
      "allTime": "Desde o início",
      "sevenDays": "Últimos 7 dias",
      "thirtyDays": "Últimos 30 dias",
      "oneYear": "Último ano",
      "weightChange": "Mudança de Peso",
      "bmiChange": "Mudança IMC (%)"
    },
    "units": {
      "title": "Preferências de Unidades",
      "weight": "Peso",
      "height": "Altura",
      "measurements": "Medidas",
      "kg": "kg",
      "lbs": "lbs",
      "cm": "cm",
      "ft": "pés",
      "in": "pol"
    }
  },
  "weightForm": {
    "title": "Adicionar Registo de Peso",
    "dateLabel": "Data",
    "weightLabel": "Peso ({{unit}})",
    "weightPlaceholder": "ex: 75.5",
    "saveButton": "Guardar Peso",
    "validationError": "Por favor, insira um peso válido e selecione uma data."
  },
  "measurementForm": {
    "title": "Registar Medidas",
    "dateLabel": "Data",
    "waistLabel": "Cintura ({{unit}})",
    "hipsLabel": "Ancas ({{unit}})",
    "chestLabel": "Peito ({{unit}})",
    "rightArmLabel": "Bíceps Direito ({{unit}})",
    "leftArmLabel": "Bíceps Esquerdo ({{unit}})",
    "rightLegLabel": "Quadríceps Direito ({{unit}})",
    "leftLegLabel": "Quadríceps Esquerdo ({{unit}})",
    "saveButton": "Guardar Medidas"
  },
  "history": {
    "title": "Histórico de Peso",
    "noEntries": "Ainda não há registos de peso. Adicione um para começar!",
    "dateHeader": "Data",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Ações",
    "deleteLabel": "Eliminar registo"
  },
  "measurementHistory": {
    "title": "Histórico de Medidas",
    "noEntries": "Nenhuma medida registada ainda.",
    "dateHeader": "Data",
    "waistHeader": "Cintura",
    "hipsHeader": "Ancas",
    "chestHeader": "Peito",
    "rightArmHeader": "Bícep D.",
    "leftArmHeader": "Bícep E.",
    "rightLegHeader": "Quád. D.",
    "leftLegHeader": "Quád. E.",
    "actionsHeader": "Ações"
  },
  "charts": {
    "noDataWeight": "Insira pelo menos dois registos de peso para ver o seu gráfico de progresso.",
    "noDataBmi": "Insira pelo menos dois registos de peso para ver o seu gráfico de tendência de IMC.",
    "noDataMeasurements": "Registe pelo menos dois conjuntos de medidas para ver o seu gráfico de tendências.",
    "weightLabel": "Peso",
    "bmiLabel": "IMC",
    "yAxisLabelWeight": "Peso ({{unit}})",
    "yAxisLabelBmi": "IMC",
    "measurementTrend": "Tendência de Medidas",
    "waist": "Cintura",
    "hips": "Ancas",
    "chest": "Peito",
    "right_arm": "Bíceps Direito",
    "left_arm": "Bíceps Esquerdo",
    "right_leg": "Quadríceps Direito",
    "left_leg": "Quadríceps Esquerdo"
  },
  "achievements": {
    "title": "Conquistas",
    "modalTitle": "Nova Conquista Desbloqueada!",
    "modalClose": "Fantástico!",
    "firstStep": {
      "title": "Primeiro Passo",
      "description": "Registou o seu primeiro peso. A jornada começa!"
    },
    "fivePercent": {
      "title": "A Progredir",
      "description": "Perdeu 5% do seu peso corporal inicial. Continue assim!"
    },
    "tenPercent": {
      "title": "Em Grande!",
      "description": "Perdeu 10% do seu peso corporal inicial. Incrível!"
    },
    "bmiImproved": {
      "title": "Mais Saudável",
      "description": "Melhorou a sua categoria de IMC. Um marco importante!"
    },
    "goalReached": {
      "title": "Meta Cumprida!",
      "description": "Atingiu a sua meta final de peso. Parabéns!"
    }
  },
  "aiCoach": {
    "title": "Análise do Assistente Zen",
    "getAnalysisButton": "Obter a Minha Análise",
    "loading": "O Zen está a analisar o seu progresso...",
    "error": "Desculpe, não consegui completar a análise neste momento. Por favor, tente novamente mais tarde.",
    "intro": "Aqui está uma rápida visão do seu progresso:"
  },
  "avatarCard": {
    "title": "Seu Avatar Zen",
    "noData": "Adicione algumas medidas corporais para ver o seu avatar.",
    "showingDataFor": "Mostrando dados de {{date}}"
  }
};


export const supportedLngs = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇵🇹' },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      es: { translation: translationES },
      pt: { translation: translationPT },
    },
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18next;