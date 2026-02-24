#!/bin/bash

usage="Set your secrets into GSM
$(basename "$0") --project <gcp_project_name> --app <app_name> --secret-name <secret_name>
  (--secret-value <secret_value> | --secret-file <file_path> --pod-file-path <file_path>)
  --vertical <se_vertical> --tribe <se_tribe> --squad <se_squad> [-y | --suppress-confirmation] [-h | --help]

[OPTIONS]:
  -h | --help                    Display this help message
  -y | --suppress-confirmation   Suppress confirmation and creates env without prompting
  --project <gcp_project_name>   GCP Project name (eg. maga-homolog, magalu-ops-transacional, etc.)
  --app <app_name>               App name, usually the same as ArgoCD name
  --secret-name <secret_name>    Env name. If you are creating a secret file, this name must be the
                                 env that will use the file (eg. \"GOOGLE_APPLICATION_CREDENTIALS\")
  --secret-value <secret_value>  Env content
  --secret-file <file_path>      Path to file in your machine. This arg is mutually exclusive with
                                 [--secret-value]
  --pod-file-path <file_path>    Path where the secret file will be stored in your app\'s pod (eg.
                                 \"/application/files/credentials.json\"). Will only take effect if
                                 [--secret-file] is provided
  --vertical <se_vertical>       Vertical name used for resource label
  --tribe <se_tribe>             Tribe name used for resource label
  --squad <se_squad>             Squad name used for resource label
"

SUPPRESS_CONFIRMATION="false"

PROJECT=""
APP=""
SECRET_NAME=""
SECRET_VALUE=""
SECRET_FILE=""
POD_FILE_PATH=""
POD_FILE_NAME=""
ENVIRONMENT=""

LABEL_ORG="magazineluiza"
LABEL_ELEMENT_NAME="secret_manager"
LABEL_TRIBE=""
LABEL_VERTICAL=""
LABEL_SQUAD=""
LABEL_ENVIRONMENT=""
LABEL_PRODUCT=""

stageProjects=('maga-homolog' 'magalu-homolog' 'softbox-magalu-232913')
homeDir=$HOME
configFilePath='$homeDir/.gsmpath.config'

function checkPrerequisites() {
  hasGcloud=$(command -v gcloud)

  if [[ "$hasGcloud" == "" ]]; then
    echo "Please install 'gcloud' app before proceeding"
    echo "https://cloud.google.com/sdk/docs/install"
    return 1
  fi

  hasJq=$(command -v jq)

  if [[ "$hasJq" == "" ]]; then
    echo "Please install 'jq' app before proceeding"
    echo "https://stedolan.github.io/jq/download/"
    return 1
  fi

  return 0
}

function to_upper() {
  echo $1 | tr '[:lower:]' '[:upper:]'
}

function to_lower() {
  echo $1 | tr '[:upper:]' '[:lower:]'
}

function parseArgs() {
  if [[ $# -lt 10 ]]; then
    return 1
  fi

  while [[ $# > 0 ]]; do
    key="$1"
    case $key in
      -h|--help)
        return 1
        ;;
      -y|--suppress-confirmation)
        SUPPRESS_CONFIRMATION="true"
        shift
        ;;
      --project)
        PROJECT=$(to_lower "$2")
        shift
        shift
        ;;
      --app)
        APP=$(to_upper "$2")
        shift
        shift
        ;;
      --secret-name)
        SECRET_NAME=$(to_upper "$2")
        shift
        shift
        ;;
      --secret-value)
        SECRET_VALUE="$2"
        shift
        shift
        ;;
      --secret-file)
        SECRET_FILE="$2"
        shift
        shift
        ;;
      --pod-file-path)
        POD_FILE_PATH="$2"
        shift
        shift
        ;;
      --vertical)
        LABEL_VERTICAL=$(to_lower "$2")
        shift
        shift
        ;;
      --tribe)
        LABEL_TRIBE=$(to_lower "$2")
        shift
        shift
        ;;
      --squad)
        LABEL_SQUAD=$(to_lower "$2")
        shift
        shift
        ;;
      *)
        return 1
        ;;
    esac
  done

  if [[ "$SECRET_FILE" != "" && "$SECRET_VALUE" != "" ]]; then
    echo \[ERROR\] If "--secret-file" is provided, there shouldn\'t be any "--secret-value" set
    echo 
    return 1
  fi

  if [[ "$SECRET_FILE" == "" && "$SECRET_VALUE" == "" ]]; then
    echo \[ERROR\] Must provide either "--secret-file" or "--secret-value"
    echo
    return 1
  fi 

  if [[ "$SECRET_FILE" != "" && "$POD_FILE_PATH" == "" ]]; then
    echo \[ERROR\] Must provide "--pod-file-path" when creating secret file
    echo
    return 1
  fi

  if [[ "$SECRET_FILE" != "" && "$SECRET_NAME" == "" ]]; then
    echo \[ERROR\] Must provide "--secret-name" when creating secret file
    echo
    return 1
  fi 

  if [[ "$POD_FILE_PATH" != "" ]]; then
    POD_FILE_NAME="${POD_FILE_PATH##*/}"
    POD_FILE_PATH="${POD_FILE_PATH%/*}/"
  fi

  ENVIRONMENT="PRD"
  for stageProject in "${stageProjects[@]}"; do
    if [[ "$stageProject" == $PROJECT ]]; then
      ENVIRONMENT="HML"
    fi
  done

  LABEL_ENVIRONMENT=$(to_lower "$ENVIRONMENT")
  LABEL_PRODUCT=$(to_lower "$APP")

  if [[
    "$PROJECT" == "" ||
    "$APP" == "" ||
    "$SECRET_NAME" == "" ||
    "$LABEL_VERTICAL" == "" ||
    "$LABEL_TRIBE" == "" ||
    "$LABEL_SQUAD" == ""
  ]]; then
    echo \[ERROR\] Missing parameters
    echo
    return 1
  fi

  if [[ "$ENVIRONMENT" == "HML" && "$SECRET_NAME" == "GOOGLE_APPLICATION_CREDENTIALS" ]]; then
    SECRET_NAME="GOOGLE_APPLICATION_CREDENTIALS_REPLACEMENT"
  fi
}

function getGsmEnvName() {
  echo "${APP}_${ENVIRONMENT}_${SECRET_NAME}"
}

function createEnv() {
  gsmEnvName="$1"

  gcloud secrets create $gsmEnvName \
    --project $PROJECT \
    --labels="se_element_name=$LABEL_ELEMENT_NAME,\
se_environment=$LABEL_ENVIRONMENT,\
se_org=$LABEL_ORG,\
se_product=$LABEL_PRODUCT,\
se_squad=$LABEL_SQUAD,\
se_vertical=$LABEL_VERTICAL,\
se_tribe=$LABEL_TRIBE"
}

function addEnvVersion() {
  gsmEnvName="$1"

  if [[ "$SECRET_FILE" != "" ]]; then
    gcloud secrets versions add --project $PROJECT $gsmEnvName --data-file="$SECRET_FILE"
  else
    printf "%s" "$SECRET_VALUE" | gcloud secrets versions add --project $PROJECT $gsmEnvName --data-file=-
  fi
}

function getGsmFullEnvName() {
  gsmEnvName="$1"
  gsmFullEnvName=$( \
    gcloud secrets versions list \
      --project $PROJECT $gsmEnvName \
      --format="json" | \
    jq -r ". | sort_by(.name) | .[-1].name" \
  )

  echo $gsmFullEnvName
}

######################################################################################################

if ! checkPrerequisites; then
  exit 1
fi
if parseArgs "$@"; then
  echo "--------------"
  echo "GCP_Project:   \"$PROJECT\""
  echo "Environment:   \"$ENVIRONMENT\""
  echo "App:           \"$APP\""
  echo "Secret_name:   \"$SECRET_NAME\""
  if [[ "$SECRET_FILE" != "" ]]; then
    echo "Secret_file:   \"$SECRET_FILE\""
    echo "Pod_file_path: \"$POD_FILE_PATH\""
    echo "Pod_file_name: \"$POD_FILE_NAME\""
  else
    echo "Secret_value:  \"$SECRET_VALUE\""
  fi
  echo "--------------"

  if [ ${SUPPRESS_CONFIRMATION} != "true" ]; then
    echo Confirm env creation\? \(y/N\)
    read CONTINUE_OPT
    if [ -z "${CONTINUE_OPT}" ] || ([ ${CONTINUE_OPT} != "y" ] && [ ${CONTINUE_OPT} != "Y" ]); then
      echo "Cancelando alteração"
      exit 1
    fi
  fi
else
  printf "$usage"
  exit 1
fi

gsmEnvName=$(getGsmEnvName)

echo Creating env \"$gsmEnvName\" into GSM
createEnv $gsmEnvName

echo Appending a new version to env \"$gsmEnvName\"
addEnvVersion $gsmEnvName

gsmFullEnvName=$(getGsmFullEnvName $gsmEnvName)

echo ""
echo ""
echo " /*****************************************************************\ "
echo " | Please update your 'values.yaml' file with the following data:  | "
echo " \*****************************************************************/ "
if [[ "$SECRET_FILE" != "" ]]; then
  if [[ "$ENVIRONMENT" == "HML" && "$SECRET_NAME" == "GOOGLE_APPLICATION_CREDENTIALS_REPLACEMENT" ]]; then
    echo "    - name: '$SECRET_NAME'"
    echo "      value: '$POD_FILE_PATH$POD_FILE_NAME'"
    echo "    - name: 'DO_NOT_SILENCE_GOOGLE_APPLICATION_CREDENTIALS'"
    echo "      value: 'true'"
  fi
  echo "    - name: 'SI_TO_FILE_$SECRET_NAME'"
  echo "      value: '{\"SecretName\":\"$SECRET_NAME\",\"SecretKey\":\"gcp:secretmanager:$gsmFullEnvName\",\"PodFilePath\":\"$POD_FILE_PATH\",\"PodFileName\":\"$POD_FILE_NAME\"}'"
else
  echo "    - name: '$SECRET_NAME'"
  echo "      value: 'gcp:secretmanager:$gsmFullEnvName'"
fi
