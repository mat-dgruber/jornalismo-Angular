@echo off
setlocal

echo ========================================================
echo   DEPLOY AUTOMATIZADO - GOOGLE CLOUDRUN (BACKEND)
echo ========================================================

:: Adicionar gcloud ao PATH temporariamente (caso instalacao automatica nao tenha pego)
set "PATH=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin;%PATH%"

:: 1. Verificar se usuario esta logado
echo.
echo [1/4] Verificando login no gcloud...
call gcloud auth print-identity-token >nul 2>&1
if %errorlevel% neq 0 (
    echo Voce nao esta logado. Abrindo login...
    call gcloud auth login
) else (
    echo Logado com sucesso.
)

:: 2. Configurar Projeto (Pede ao usuario se nao tiver setado)
echo.
echo [2/4] Configurando projeto...
set /p PROJECT_ID="Digite o ID do seu projeto no Google Cloud (ex: jornalismo-angular-123): "
call gcloud config set project %PROJECT_ID%

:: 3. Build & Push da Imagem (Artifact Registry)
echo.
echo [3/4] Construindo e enviando imagem Docker (pode demorar)...
call gcloud builds submit --tag gcr.io/%PROJECT_ID%/backend .

:: 4. Deploy no Cloud Run
echo.
echo [4/4] Fazendo deploy no Cloud Run...
echo IMPORTANTE: Na primeira vez, escolha a regiao (ex: 29 para us-central1 ou digite 'us-central1')
echo.

:: Pega a URL do Database do arquivo .env local para injetar no Cloud Run
for /f "tokens=1,2 delims==" %%a in ('type .env') do (
    if "%%a"=="DATABASE_URL" set DATABASE_URL=%%b
)

:: Se nao achou no .env, avisa
if "%DATABASE_URL%"=="" (
    echo AVISO: Nao encontrei DATABASE_URL no .env. Voce tera que configurar manualmente no Painel do Google.
    pause
)

call gcloud run deploy backend ^
  --image gcr.io/%PROJECT_ID%/backend ^
  --platform managed ^
  --allow-unauthenticated ^
  --set-env-vars "DATABASE_URL=%DATABASE_URL%,DEBUG=False,GS_BUCKET_NAME=SEU_BUCKET_AQUI" 

echo.
echo ========================================================
echo   DEPLOY FINALIZADO!
echo ========================================================
echo Se deu tudo certo, a URL do seu site esta ai em cima.
echo Configure as variaveis restantes (SECRET_KEY, etc) no painel do Cloud Run se precisar.
echo.
pause
