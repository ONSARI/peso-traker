import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Directamente incrusta el JSON de traducción en el código
// para evitar cualquier problema con la resolución de módulos de archivos.

const translationEN = {
  "auth": {
    "loading": "Loading...",
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
    "emailPlaceholder": "Your email address",
    "passwordPlaceholder": "Your password",
    "signupButton": "Sign Up",
    "signingUpButton": "Signing up...",
    "switchToLogin": "Already have an account? Log in",
    "loginTitle": "Welcome Back!",
    "loginInstruction": "Log in with your email and password.",
    "loginButton": "Log In",
    "loggingInButton": "Logging In...",
    "switchToSignup": "Don't have an account? Sign up",
    "signupSuccessMessage": "Account created! Please check your email to verify your account.",
    "profileCreationError": "Account created! But we couldn't save your profile: {{message}}. Please contact support.",
    "forgotPasswordLink": "Forgot your password?",
    "forgotPasswordTitle": "Reset Password",
    "forgotPasswordInstruction": "Enter your email address and we'll send you a link to reset your password.",
    "sendResetLinkButton": "Send Reset Link",
    "sendingLinkButton": "Sending...",
    "passwordResetSuccessMessage": "Password reset link sent! Check your email.",
    "backToLogin": "Back to Login",
    "invalidCredentialsError": "Invalid email or password. If you are an existing user, try the 'Forgot Password' link to set a new one."
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
    "measurementFetchError": "Could not load your measurement entries. Please try refreshing the page.",
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
      "fullSQLScript": "-- This script resets and creates the necessary security policies for all tables.\n-- It is safe to run multiple times.\n\n-- 1. Enable RLS on all tables\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Clean up old policies on 'profiles' table\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Create correct policies for 'profiles' table\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Clean up old policies on 'weights' table\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual update access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Create correct policies for 'weights' table\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on weights\"\nON public.weights FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Clean up old policies on 'measurements' table\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual update access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\n-- 7. Create correct policies for 'measurements' table\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on measurements\"\nON public.measurements FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Database Schema Error",
      "body": "The app failed because your 'profiles' table is missing columns needed for goal-setting and unit preferences. This is a simple configuration issue.",
      "script": "-- This script adds missing goal and unit columns to your 'profiles' table.\n-- This is necessary for goal-setting and unit preference features to work.\n-- It's safe to run this multiple times.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8,\nADD COLUMN IF NOT EXISTS weight_unit text CHECK (weight_unit IN ('kg', 'lbs')),\nADD COLUMN IF NOT EXISTS height_unit text CHECK (height_unit IN ('cm', 'ft')),\nADD COLUMN IF NOT EXISTS measurement_unit text CHECK (measurement_unit IN ('cm', 'in'));"
    },
    "tryAgainButton": "Log Out and Try Again",
    "profileUpdateError": "Failed to save profile changes.",
    "profileUpdateSchemaError": "Failed to save. Please fix the database schema issue shown in 'Your Goals' to enable this feature.",
    "weightAddError": "Failed to add weight entry.",
    "weightDeleteError": "Failed to delete weight entry.",
    "weightUpdateError": "Failed to update weight entry.",
    "measurementAddError": "Failed to add measurement entry.",
    "measurementDeleteError": "Failed to delete measurement entry.",
    "measurementUpdateError": "Failed to update measurement entry.",
    "errorDetails": "Details: {{details}}",
    "unknownError": "An unexpected error occurred. Please try again."
  },
  "goldenRatioCard": {
    "title": "Golden Ratio",
    "index": "Index",
    "rank": "Rank",
    "male": "Male",
    "female": "Female",
    "noData": "Log your weight and measurements to get started.",
    "noMeasurements": "Log your shoulder and waist measurements to calculate your index."
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
      "addGoal": "Add Goal",
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
    "bicepLabel": "Bicep ({{unit}})",
    "thighLabel": "Thigh ({{unit}})",
    "shouldersLabel": "Shoulders ({{unit}})",
    "calvesLabel": "Calves ({{unit}})",
    "saveButton": "Save Measurements"
  },
  "history": {
    "title": "Weight History",
    "noEntries": "No weight entries yet. Add one to get started!",
    "dateHeader": "Date",
    "weightHeader": "Weight ({{unit}})",
    "actionsHeader": "Actions",
    "deleteLabel": "Delete entry",
    "editLabel": "Edit entry",
    "saveChanges": "Save Changes",
    "editWeightTitle": "Edit Weight Entry",
    "editMeasurementTitle": "Edit Measurement Entry"
  },
  "measurementHistory": {
    "title": "Measurement History",
    "noEntries": "No measurements logged yet.",
    "dateHeader": "Date",
    "waistHeader": "Waist",
    "hipsHeader": "Hips",
    "chestHeader": "Chest",
    "bicepHeader": "Bicep",
    "thighHeader": "Thigh",
    "shouldersHeader": "Shoulders",
    "calvesHeader": "Calves",
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
    "bicep": "Bicep",
    "thigh": "Thigh",
    "shoulders": "Shoulders",
    "calves": "Calves"
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
  "tabs": {
    "charts": "Charts",
    "history": "History",
    "aiCoach": "AI Coach"
  }
};

const translationES = {
 "auth": {
    "loading": "Cargando...",
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
    "emailPlaceholder": "Tu dirección de correo electrónico",
    "passwordPlaceholder": "Tu contraseña",
    "signupButton": "Registrarse",
    "signingUpButton": "Registrando...",
    "switchToLogin": "¿Ya tienes una cuenta? Inicia sesión",
    "loginTitle": "¡Bienvenido de Vuelta!",
    "loginInstruction": "Inicia sesión con tu correo y contraseña.",
    "loginButton": "Iniciar Sesión",
    "loggingInButton": "Iniciando sesión...",
    "switchToSignup": "¿No tienes cuenta? Regístrate",
    "signupSuccessMessage": "¡Cuenta creada! Revisa tu correo electrónico para verificar tu cuenta.",
    "profileCreationError": "¡Cuenta creada! Pero no pudimos guardar tu perfil: {{message}}. Por favor, contacta con soporte.",
    "forgotPasswordLink": "¿Olvidaste tu contraseña?",
    "forgotPasswordTitle": "Restablecer Contraseña",
    "forgotPasswordInstruction": "Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    "sendResetLinkButton": "Enviar Enlace",
    "sendingLinkButton": "Enviando...",
    "passwordResetSuccessMessage": "¡Enlace de restablecimiento enviado! Revisa tu correo electrónico.",
    "backToLogin": "Volver al inicio de sesión",
    "invalidCredentialsError": "Correo o contraseña incorrectos. Si ya eras usuario, prueba el enlace '¿Olvidaste tu contraseña?' para crear una nueva."
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
    "measurementFetchError": "No se pudieron cargar tus registros de medidas. Por favor, intenta refrescar la página.",
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
      "fullSQLScript": "-- Este script reinicia y crea las políticas de seguridad necesarias para todas las tablas.\n-- Es seguro ejecutarlo varias veces.\n\n-- 1. Habilitar RLS en todas las tablas\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Limpiar políticas antiguas en la tabla 'profiles'\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Los usuarios pueden actualizar su propio perfil\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Crear políticas correctas para la tabla 'profiles'\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Limpiar políticas antiguas en la tabla 'weights'\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual update access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Crear políticas correctas para la tabla 'weights'\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on weights\"\nON public.weights FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Limpiar políticas antiguas en la tabla 'measurements'\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual update access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\n-- 7. Crear políticas correctas para la tabla 'measurements'\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on measurements\"\nON public.measurements FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Error de Esquema de la Base de Datos",
      "body": "La aplicación falló porque a tu tabla 'profiles' le faltan columnas para los objetivos y las preferencias de unidades. Este es un simple problema de configuración.",
      "script": "-- Este script añade las columnas que faltan para objetivos y unidades a tu tabla 'profiles'.\n-- Es necesario para que funcionen las características de objetivos y preferencias de unidades.\n-- Es seguro ejecutarlo varias veces.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8,\nADD COLUMN IF NOT EXISTS weight_unit text CHECK (weight_unit IN ('kg', 'lbs')),\nADD COLUMN IF NOT EXISTS height_unit text CHECK (height_unit IN ('cm', 'ft')),\nADD COLUMN IF NOT EXISTS measurement_unit text CHECK (measurement_unit IN ('cm', 'in'));"
    },
    "tryAgainButton": "Cerrar Sesión e Intentar de Nuevo",
    "profileUpdateError": "No se pudieron guardar los cambios del perfil.",
    "profileUpdateSchemaError": "No se pudo guardar. Por favor, soluciona el problema de esquema de la base de datos que se muestra en 'Tus Objetivos' para habilitar esta función.",
    "weightAddError": "No se pudo añadir el registro de peso.",
    "weightDeleteError": "No se pudo eliminar el registro de peso.",
    "weightUpdateError": "No se pudo actualizar el registro de peso.",
    "measurementAddError": "No se pudo añadir el registro de medidas.",
    "measurementDeleteError": "No se pudo eliminar el registro de medidas.",
    "measurementUpdateError": "No se pudo actualizar el registro de medidas.",
    "errorDetails": "Detalles: {{details}}",
    "unknownError": "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
  },
  "goldenRatioCard": {
    "title": "Índice Áureo",
    "index": "Índice",
    "rank": "Rango",
    "male": "Hombre",
    "female": "Mujer",
    "noData": "Registra tu peso y medidas para empezar.",
    "noMeasurements": "Registra tus medidas de hombros y cintura para calcular tu índice."
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
      "addGoal": "Añadir Objetivo",
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
    "bicepLabel": "Bíceps ({{unit}})",
    "thighLabel": "Muslo ({{unit}})",
    "shouldersLabel": "Hombros ({{unit}})",
    "calvesLabel": "Gemelos ({{unit}})",
    "saveButton": "Guardar Medidas"
  },
  "history": {
    "title": "Historial de Peso",
    "noEntries": "Aún no hay registros de peso. ¡Añade uno para empezar!",
    "dateHeader": "Fecha",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Acciones",
    "deleteLabel": "Eliminar registro",
    "editLabel": "Editar registro",
    "saveChanges": "Guardar Cambios",
    "editWeightTitle": "Editar Registro de Peso",
    "editMeasurementTitle": "Editar Registro de Medidas"
  },
  "measurementHistory": {
    "title": "Historial de Medidas",
    "noEntries": "Aún no hay medidas registradas.",
    "dateHeader": "Fecha",
    "waistHeader": "Cintura",
    "hipsHeader": "Cadera",
    "chestHeader": "Pecho",
    "bicepHeader": "Bíceps",
    "thighHeader": "Muslo",
    "shouldersHeader": "Hombros",
    "calvesHeader": "Gemelos",
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
    "bicep": "Bíceps",
    "thigh": "Muslo",
    "shoulders": "Hombros",
    "calves": "Gemelos"
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
  "tabs": {
    "charts": "Gráficos",
    "history": "Historial",
    "aiCoach": "Asistente IA"
  }
};

const translationPT = {
  "auth": {
    "loading": "Carregando...",
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
    "emailPlaceholder": "O seu endereço de e-mail",
    "passwordPlaceholder": "Sua senha",
    "signupButton": "Registrar",
    "signingUpButton": "Registrando...",
    "switchToLogin": "Já tem uma conta? Inicie sessão",
    "loginTitle": "Bem-vindo de Volta!",
    "loginInstruction": "Inicie sessão com o seu e-mail e senha.",
    "loginButton": "Iniciar Sessão",
    "loggingInButton": "A iniciar sessão...",
    "switchToSignup": "Não tem conta? Registre-se",
    "signupSuccessMessage": "Conta criada! Por favor, verifique o seu e-mail para confirmar a sua conta.",
    "profileCreationError": "Conta criada! Mas não foi possível guardar o seu perfil: {{message}}. Por favor, contacte o suporte.",
    "forgotPasswordLink": "Esqueceu a sua senha?",
    "forgotPasswordTitle": "Redefinir Senha",
    "forgotPasswordInstruction": "Insira o seu endereço de e-mail e enviaremos um link para redefinir a sua senha.",
    "sendResetLinkButton": "Enviar Link",
    "sendingLinkButton": "Enviando...",
    "passwordResetSuccessMessage": "Link de redefinição de senha enviado! Verifique o seu e-mail.",
    "backToLogin": "Voltar ao início de sessão",
    "invalidCredentialsError": "E-mail ou senha inválidos. Se você já é um usuário, tente o link 'Esqueceu a sua senha?' para criar uma nova."
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
    "measurementFetchError": "Não foi possível carregar os seus registos de medidas. Por favor, tente atualizar a página.",
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
      "fullSQLScript": "-- Este script redefine e cria as políticas de segurança necessárias para todas as tabelas.\n-- É seguro executá-lo várias vezes.\n\n-- 1. Ativar RLS em todas as tabelas\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;\n\n-- 2. Limpar políticas antigas na tabela 'profiles'\nDROP POLICY IF EXISTS \"Enable read access for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can view their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable update for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can update their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Los usuarios pueden actualizar su propio perfil\" ON public.profiles;\nDROP POLICY IF EXISTS \"Enable insert for own user\" ON public.profiles;\nDROP POLICY IF EXISTS \"Users can insert their own profile.\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual read access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual update access on profiles\" ON public.profiles;\nDROP POLICY IF EXISTS \"Allow individual insert access on profiles\" ON public.profiles;\n\n-- 3. Criar políticas corretas para a tabela 'profiles'\nCREATE POLICY \"Allow individual read access on profiles\"\nON public.profiles FOR SELECT\nUSING (auth.uid() = id);\n\nCREATE POLICY \"Allow individual update access on profiles\"\nON public.profiles FOR UPDATE\nUSING (auth.uid() = id) WITH CHECK (auth.uid() = id);\n\nCREATE POLICY \"Allow individual insert access on profiles\"\nON public.profiles FOR INSERT\nWITH CHECK (auth.uid() = id);\n\n-- 4. Limpar políticas antigas na tabela 'weights'\nDROP POLICY IF EXISTS \"Allow individual read access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual insert access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual update access on weights\" ON public.weights;\nDROP POLICY IF EXISTS \"Allow individual delete access on weights\" ON public.weights;\n\n-- 5. Criar políticas corretas para a tabela 'weights'\nCREATE POLICY \"Allow individual read access on weights\"\nON public.weights FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on weights\"\nON public.weights FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on weights\"\nON public.weights FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on weights\"\nON public.weights FOR DELETE\nUSING (auth.uid() = user_id);\n\n-- 6. Limpar políticas antigas na tabela 'measurements'\nDROP POLICY IF EXISTS \"Allow individual read access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual insert access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual update access on measurements\" ON public.measurements;\nDROP POLICY IF EXISTS \"Allow individual delete access on measurements\" ON public.measurements;\n\n-- 7. Criar políticas corretas para a tabela 'measurements'\nCREATE POLICY \"Allow individual read access on measurements\"\nON public.measurements FOR SELECT\nUSING (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual insert access on measurements\"\nON public.measurements FOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual update access on measurements\"\nON public.measurements FOR UPDATE\nUSING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n\nCREATE POLICY \"Allow individual delete access on measurements\"\nON public.measurements FOR DELETE\nUSING (auth.uid() = user_id);\n"
    },
    "schemaError": {
      "title": "Erro de Esquema da Base de Dados",
      "body": "A aplicação falhou porque a sua tabela 'profiles' não tem colunas para metas e preferências de unidade. Este é um problema de configuração simples.",
      "script": "-- Este script adiciona as colunas de meta e unidade em falta à sua tabela 'profiles'.\n-- Isto é necessário para que as funcionalidades de definição de metas e preferências de unidade funcionem.\n-- É seguro executá-lo várias vezes.\n\nALTER TABLE public.profiles\nADD COLUMN IF NOT EXISTS goal_weight_1 float8,\nADD COLUMN IF NOT EXISTS goal_weight_2 float8,\nADD COLUMN IF NOT EXISTS goal_weight_final float8,\nADD COLUMN IF NOT EXISTS weight_unit text CHECK (weight_unit IN ('kg', 'lbs')),\nADD COLUMN IF NOT EXISTS height_unit text CHECK (height_unit IN ('cm', 'ft')),\nADD COLUMN IF NOT EXISTS measurement_unit text CHECK (measurement_unit IN ('cm', 'in'));"
    },
    "tryAgainButton": "Sair e Tentar Novamente",
    "profileUpdateError": "Não foi possível salvar as alterações do perfil.",
    "profileUpdateSchemaError": "Falha ao salvar. Corrija o problema de esquema do banco de dados mostrado em 'Seus Objetivos' para ativar este recurso.",
    "weightAddError": "Não foi possível adicionar o registo de peso.",
    "weightDeleteError": "Não foi possível excluir o registo de peso.",
    "weightUpdateError": "Não foi possível atualizar o registo de peso.",
    "measurementAddError": "Falha ao adicionar registo de medição.",
    "measurementDeleteError": "Falha ao eliminar registo de medição.",
    "measurementUpdateError": "Falha ao atualizar registo de medição.",
    "errorDetails": "Detalhes: {{details}}",
    "unknownError": "Ocorreu um erro inesperado. Por favor, tente novamente."
  },
  "goldenRatioCard": {
    "title": "Índice Áureo",
    "index": "Índice",
    "rank": "Classificação",
    "male": "Homem",
    "female": "Mulher",
    "noData": "Registe o seu peso e medidas para começar.",
    "noMeasurements": "Registe as suas medidas de ombros e cintura para calcular o seu índice."
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
      "addGoal": "Adicionar Meta",
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
    "bicepLabel": "Bíceps ({{unit}})",
    "thighLabel": "Coxa ({{unit}})",
    "shouldersLabel": "Ombros ({{unit}})",
    "calvesLabel": "Panturrilhas ({{unit}})",
    "saveButton": "Guardar Medidas"
  },
  "history": {
    "title": "Histórico de Peso",
    "noEntries": "Ainda não há registos de peso. Adicione um para começar!",
    "dateHeader": "Data",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Ações",
    "deleteLabel": "Eliminar registo",
    "editLabel": "Editar registo",
    "saveChanges": "Guardar Alterações",
    "editWeightTitle": "Editar Registo de Peso",
    "editMeasurementTitle": "Editar Registo de Medidas"
  },
  "measurementHistory": {
    "title": "Histórico de Medidas",
    "noEntries": "Nenhuma medida registada ainda.",
    "dateHeader": "Data",
    "waistHeader": "Cintura",
    "hipsHeader": "Ancas",
    "chestHeader": "Peito",
    "bicepHeader": "Bíceps",
    "thighHeader": "Coxa",
    "shouldersHeader": "Ombros",
    "calvesHeader": "Panturrilhas",
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
    "bicep": "Bíceps",
    "thigh": "Coxa",
    "shoulders": "Ombros",
    "calves": "Panturrilhas"
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
   "tabs": {
    "charts": "Gráficos",
    "history": "Histórico",
    "aiCoach": "Assistente IA"
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