import React from "react"
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useTheme } from "react-native-paper"
import { useI18nContext } from "../../modules/I18nProvider"
import { useStyles } from "./styles"

interface IProps {
  isDialogVisible: boolean
  isLoading?: boolean
  loadingMessage?: string
  hasError?: boolean
  errorMessage?: string
  title: string
  message: string
  placeholder: string
  onSubmit?: (text?: string) => void
  closeDialog: () => void
}

const DialogInput = ({
  isLoading = false,
  hasError = false,
  errorMessage,
  loadingMessage,
  isDialogVisible,
  title,
  message,
  placeholder,
  onSubmit,
  closeDialog,
}: IProps) => {
  const styles = useStyles()
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const [inputValue, setInputValue] = React.useState<string>()

  const handleOnChangeText = (newTxt: string) => {
    setInputValue(newTxt)
  }

  const handleCloseDialog = () => {
    setInputValue("")
    if (!isLoading) closeDialog()
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(inputValue)
  }

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={isDialogVisible}
      onRequestClose={handleCloseDialog}
    >
      <View style={[styles.container]}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleCloseDialog}>
          <View style={[styles.modalContainer]}>
            {isLoading && (
              <View style={styles.modalBody}>
                <Text style={[loadingMessage ? styles.messageModal : { height: 0 }]}>
                  {loadingMessage}
                </Text>
                <ActivityIndicator animating size="large" color={theme.colors.primary} />
              </View>
            )}

            {!isLoading && (
              <View style={styles.modalBody}>
                <Text style={styles.titleModal}>{title}</Text>
                <Text style={[message ? styles.messageModal : { height: 0 }]}>{message}</Text>
                {hasError && (
                  <Text
                    style={[
                      errorMessage ? styles.messageModal : { height: 0 },
                      styles.messageErrorModal,
                    ]}
                  >
                    {errorMessage}
                  </Text>
                )}
                <TextInput
                  autoCapitalize="characters"
                  style={styles.inputContainer}
                  autoFocus={true}
                  underlineColorAndroid="transparent"
                  placeholder={placeholder}
                  onChangeText={handleOnChangeText}
                  value={inputValue}
                />
              </View>
            )}
            {!isLoading && (
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.touchBouttonModal} onPress={handleCloseDialog}>
                  <Text style={styles.btnModalLeft}>{i18n.t("dialog.cancellabel")}</Text>
                </TouchableOpacity>
                <View style={styles.divider_btn}></View>
                <TouchableOpacity style={styles.touchBouttonModal} onPress={handleSubmit}>
                  <Text style={styles.btnModalRight}>{i18n.t("dialog.submitlabel")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default DialogInput
