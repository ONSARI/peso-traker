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
    "phoneVerificationNotice": "You will receive an SMS for verification.",
    "signupButton": "Sign Up",
    "signingUpButton": "Signing up...",
    "switchToLogin": "Already have an account? Log in",
    "loginTitle": "Welcome Back!",
    "loginInstruction": "Log in to your account to continue.",
    "loginPhonePlaceholder": "Your phone number",
    "loginButton": "Log In",
    "loggingInButton": "Loading...",
    "switchToSignup": "Don't have an account? Sign up",
    "otpSuccessMessage": "Registration almost complete! Check your phone for the verification code.",
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
    "rlsErrorTitle": "Possible Cause and Solution",
    "rlsErrorBody": "This error almost always occurs because the <1>profiles</1> and <1>weights</1> tables do not have the correct Row Level Security (RLS) policies. Without them, your application does not have permission to read the data.",
    "rlsErrorSolution": "<1>Solution:</1> Go to the <3>SQL Editor</3> in your Supabase dashboard and run the RLS setup script to create the necessary policies.",
    "tryAgainButton": "Log Out and Try Again"
  },
  "bmiCard": {
    "title": "Your Status",
    "lastWeight": "Last Weight",
    "height": "Height",
    "bmiLabel": "Your BMI",
    "notAvailable": "N/A",
    "goalWeight": "Goal Weight",
    "setGoal": "Set Goal",
    "goalReached": "Goal Reached! 🎉",
    "toLose": "to lose",
    "toGain": "to gain",
    "underweight": "Underweight",
    "normal": "Normal weight",
    "overweight": "Overweight",
    "obesity1": "Obesity Grade I",
    "obesity2": "Obesity Grade II",
    "obesity3": "Obesity Grade III (Morbid)",
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
  "history": {
    "title": "Weight History",
    "noEntries": "No weight entries yet. Add one to get started!",
    "dateHeader": "Date",
    "weightHeader": "Weight ({{unit}})",
    "actionsHeader": "Actions",
    "deleteLabel": "Delete entry"
  },
  "charts": {
    "noDataWeight": "Enter at least two weight entries to see your progress chart.",
    "noDataBmi": "Enter at least two weight entries to see your BMI trend chart.",
    "weightLabel": "Weight",
    "bmiLabel": "BMI",
    "yAxisLabelWeight": "Weight ({{unit}})",
    "yAxisLabelBmi": "BMI"
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
      "description": "You've reached your target weight. Congratulations!"
    }
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
    "phoneVerificationNotice": "Recibirás un SMS de verificación.",
    "signupButton": "Registrarse",
    "signingUpButton": "Registrando...",
    "switchToLogin": "¿Ya tienes una cuenta? Inicia sesión",
    "loginTitle": "¡Bienvenido de Vuelta!",
    "loginInstruction": "Ingresa a tu cuenta para continuar.",
    "loginPhonePlaceholder": "Tu número de teléfono",
    "loginButton": "Iniciar Sesión",
    "loggingInButton": "Cargando...",
    "switchToSignup": "¿No tienes cuenta? Regístrate",
    "otpSuccessMessage": "¡Registro casi completo! Revisa tu teléfono para obtener el código de verificación.",
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
    "rlsErrorTitle": "Posible Causa y Solución",
    "rlsErrorBody": "Este error casi siempre ocurre porque las tablas <1>profiles</1> y <1>weights</1> no tienen las políticas de seguridad (RLS) correctas. Sin ellas, tu aplicación no tiene permiso para leer los datos.",
    "rlsErrorSolution": "<1>Solución:</1> Ve al <3>SQL Editor</3> en tu panel de Supabase y ejecuta el script de configuración de RLS para crear las políticas necesarias.",
    "tryAgainButton": "Cerrar Sesión e Intentar de Nuevo"
  },
  "bmiCard": {
    "title": "Tu Estado",
    "lastWeight": "Último Peso",
    "height": "Altura",
    "bmiLabel": "Tu IMC",
    "notAvailable": "N/A",
    "goalWeight": "Peso Objetivo",
    "setGoal": "Establecer Objetivo",
    "goalReached": "¡Objetivo Alcanzado! 🎉",
    "toLose": "por perder",
    "toGain": "por ganar",
    "underweight": "Bajo peso",
    "normal": "Peso normal",
    "overweight": "Sobrepeso",
    "obesity1": "Obesidad Grado I",
    "obesity2": "Obesidad Grado II",
    "obesity3": "Obesidad Grado III (Mórbida)",
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
  "history": {
    "title": "Historial de Peso",
    "noEntries": "Aún no hay registros de peso. ¡Añade uno para empezar!",
    "dateHeader": "Fecha",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Acciones",
    "deleteLabel": "Eliminar registro"
  },
  "charts": {
    "noDataWeight": "Introduce al menos dos registros de peso para ver tu gráfico de progreso.",
    "noDataBmi": "Introduce al menos dos registros de peso para ver tu gráfico de tendencia de IMC.",
    "weightLabel": "Peso",
    "bmiLabel": "IMC",
    "yAxisLabelWeight": "Peso ({{unit}})",
    "yAxisLabelBmi": "IMC"
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
      "description": "Has alcanzado tu peso objetivo. ¡Felicidades!"
    }
  }
};

const translationPT = {
  "auth": {
    "loading": "Carregando...",
    "verifyTitle": "Verifique seu telefone",
    "verifyInstruction": "Digite o código de 6 dígitos que enviamos para {{phone}}.",
    "verifyButton": "Verificar e continuar",
    "verifyingButton": "Verificando...",
    "backToSignup": "Voltar para o registro",
    "signupTitle": "Crie sua conta",
    "signupInstruction": "Complete seus dados para começar.",
    "namePlaceholder": "Seu nome",
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
    "phoneVerificationNotice": "Você receberá um SMS para verificação.",
    "signupButton": "Cadastrar",
    "signingUpButton": "Cadastrando...",
    "switchToLogin": "Já tem uma conta? Faça login",
    "loginTitle": "Bem-vindo de volta!",
    "loginInstruction": "Faça login em sua conta para continuar.",
    "loginPhonePlaceholder": "Seu número de telefone",
    "loginButton": "Entrar",
    "loggingInButton": "Carregando...",
    "switchToSignup": "Não tem uma conta? Cadastre-se",
    "otpSuccessMessage": "Cadastro quase completo! Verifique seu telefone para o código de verificação.",
    "profileCreationError": "Verificação bem-sucedida! Mas não conseguimos salvar seu perfil: {{message}}. Por favor, tente se registrar novamente.",
    "forgotPasswordLink": "Esqueceu sua senha?",
    "forgotPasswordTitle": "Redefinir Senha",
    "forgotPasswordInstruction": "Digite seu número de telefone e enviaremos um código para redefinir sua senha.",
    "sendResetCodeButton": "Enviar Código de Redefinição",
    "sendingCodeButton": "Enviando...",
    "updatePasswordTitle": "Atualize Sua Senha",
    "updatePasswordInstruction": "Enviamos um código para {{phone}}. Digite-o abaixo junto com sua nova senha.",
    "otpPlaceholder": "Código de Verificação",
    "newPasswordPlaceholder": "Nova Senha",
    "updatePasswordButton": "Atualizar Senha",
    "updatingPasswordButton": "Atualizando...",
    "passwordUpdateSuccess": "Sua senha foi atualizada com sucesso! Agora você pode fazer login com sua nova senha.",
    "resetCodeSuccessMessage": "Um código de redefinição de senha foi enviado para o seu telefone.",
    "backToLogin": "Voltar para o Login"
  },
  "header": {
    "greeting": "Olá, {{name}}",
    "editName": "Editar nome",
    "logout": "Sair"
  },
  "dashboard": {
    "weightTrend": "Tendência de Peso",
    "bmiTrend": "Tendência de IMC",
    "profileFetchError": "Não foi possível carregar seu perfil. Verifique as informações abaixo para resolver o problema.",
    "weightsFetchError": "Não foi possível carregar seus registros de peso. Verifique as informações abaixo para resolver o problema.",
    "syncErrorTitle": "Erro de sincronização",
    "syncErrorBody": "Detectamos uma sessão ativa, mas não conseguimos encontrar seu perfil. Isso pode ser um erro temporário.",
    "dataErrorTitle": "Erro ao carregar dados",
    "rlsErrorTitle": "Causa e solução possíveis",
    "rlsErrorBody": "Este erro quase sempre ocorre porque as tabelas <1>profiles</1> e <1>weights</1> não têm as políticas de Segurança em Nível de Linha (RLS) corretas. Sem elas, seu aplicativo não tem permissão para ler os dados.",
    "rlsErrorSolution": "<1>Solução:</1> Vá para o <3>Editor SQL</3> no seu painel do Supabase e execute o script de configuração RLS para criar as políticas necessárias.",
    "tryAgainButton": "Sair e tentar novamente"
  },
  "bmiCard": {
    "title": "Seu Status",
    "lastWeight": "Último Peso",
    "height": "Altura",
    "bmiLabel": "Seu IMC",
    "notAvailable": "N/A",
    "goalWeight": "Peso Alvo",
    "setGoal": "Definir Meta",
    "goalReached": "Meta Atingida! 🎉",
    "toLose": "a perder",
    "toGain": "a ganhar",
    "underweight": "Abaixo do peso",
    "normal": "Peso normal",
    "overweight": "Sobrepeso",
    "obesity1": "Obesidade Grau I",
    "obesity2": "Obesidade Grau II",
    "obesity3": "Obesidade Grau III (Mórbida)",
    "goalProgress": {
      "title": "Progresso da Meta",
      "progressComplete": "{{percentage}}% Completo",
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
      "bmiChange": "Mudança de IMC (%)"
    },
    "units": {
      "title": "Preferências de Unidade",
      "weight": "Peso",
      "height": "Altura",
      "kg": "kg",
      "lbs": "lbs",
      "cm": "cm",
      "ft": "pés",
      "in": "pol"
    }
  },
  "weightForm": {
    "title": "Adicionar Registro de Peso",
    "dateLabel": "Data",
    "weightLabel": "Peso ({{unit}})",
    "weightPlaceholder": "ex: 75.5",
    "saveButton": "Salvar Peso",
    "validationError": "Por favor, insira um peso válido e selecione uma data."
  },
  "history": {
    "title": "Histórico de Peso",
    "noEntries": "Ainda não há registros de peso. Adicione um para começar!",
    "dateHeader": "Data",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Ações",
    "deleteLabel": "Excluir registro"
  },
  "charts": {
    "noDataWeight": "Insira pelo menos dois registros de peso para ver seu gráfico de progresso.",
    "noDataBmi": "Insira pelo menos dois registros de peso para ver seu gráfico de tendência de IMC.",
    "weightLabel": "Peso",
    "bmiLabel": "IMC",
    "yAxisLabelWeight": "Peso ({{unit}})",
    "yAxisLabelBmi": "IMC"
  },
  "achievements": {
    "title": "Conquistas",
    "modalTitle": "Nova Conquista Desbloqueada!",
    "modalClose": "Incrível!",
    "firstStep": {
      "title": "Primeiro Passo",
      "description": "Você registrou seu primeiro peso. A jornada começa!"
    },
    "fivePercent": {
      "title": "Progredindo",
      "description": "Você perdeu 5% do seu peso corporal inicial. Continue assim!"
    },
    "tenPercent": {
      "title": "Embalado!",
      "description": "Você perdeu 10% do seu peso corporal inicial. Incrível!"
    },
    "bmiImproved": {
      "title": "Mais Saudável",
      "description": "Você melhorou sua categoria de IMC. Um marco importante!"
    },
    "goalReached": {
      "title": "Meta Batida!",
      "description": "Você atingiu seu peso alvo. Parabéns!"
    }
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