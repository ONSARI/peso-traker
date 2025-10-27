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
      "description": "You've reached your final target weight. Congratulations!"
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
      "description": "Has alcanzado tu meta final de peso. ¡Felicidades!"
    }
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
    "rlsErrorTitle": "Causa e Solução Possíveis",
    "rlsErrorBody": "Este erro ocorre quase sempre porque as tabelas <1>profiles</1> e <1>weights</1> não têm as políticas de segurança (RLS) corretas. Sem elas, a sua aplicação não tem permissão para ler os dados.",
    "rlsErrorSolution": "<1>Solução:</1> Vá ao <3>Editor de SQL</3> no seu painel do Supabase e execute o script de configuração de RLS para criar as políticas necessárias.",
    "tryAgainButton": "Sair e Tentar Novamente"
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
  "history": {
    "title": "Histórico de Peso",
    "noEntries": "Ainda não há registos de peso. Adicione um para começar!",
    "dateHeader": "Data",
    "weightHeader": "Peso ({{unit}})",
    "actionsHeader": "Ações",
    "deleteLabel": "Eliminar registo"
  },
  "charts": {
    "noDataWeight": "Insira pelo menos dois registos de peso para ver o seu gráfico de progresso.",
    "noDataBmi": "Insira pelo menos dois registos de peso para ver o seu gráfico de tendência de IMC.",
    "weightLabel": "Peso",
    "bmiLabel": "IMC",
    "yAxisLabelWeight": "Peso ({{unit}})",
    "yAxisLabelBmi": "IMC"
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
