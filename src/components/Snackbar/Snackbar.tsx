import * as React from "react"
import { Animated, SafeAreaView, StyleSheet } from "react-native"
import { Surface, Text, useTheme } from "react-native-paper"
import { color } from "react-native-reanimated"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const DURATION_SHORT = 1000
const DURATION_MEDIUM = 7000
const DURATION_LONG = 10000

interface IProps {
  duration?: number
  visible: boolean
  children?: React.ReactNode
  onDismiss: () => void
  style?: any
  wrapperStyle?: any
  variant?: "success" | "error" | "isDisater"
}

const Snackbar = (props: IProps) => {
  const {
    children,
    visible,
    onDismiss,
    style,
    wrapperStyle,
    variant = "success",
    duration = DURATION_SHORT,
    ...rest
  } = props

  const theme = useTheme()
  const { colors, roundness } = theme

  const [opacity] = React.useState(new Animated.Value(0.0))
  const [hidden, setHidden] = React.useState(!props.visible)

  let hideTimeout: number

  const show = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    setHidden(false)

    const { scale } = theme.animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200 * scale,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        const isInfinity =
          duration === Number.POSITIVE_INFINITY || duration === Number.NEGATIVE_INFINITY

        if (finished && !isInfinity) {
          hideTimeout = setTimeout(onDismiss, duration)
        }
      }
    })
  }

  const hide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    const { scale } = theme.animation
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100 * scale,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setHidden(true)
      }
    })
  }

  // Did Mount
  React.useEffect(() => {
    if (visible) {
      show()
    }

    // Will Unmount
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }
  }, [])

  // Did Update
  React.useEffect(() => {
    toggle()
  }, [visible])

  const toggle = () => {
    if (visible) {
      show()
    } else {
      hide()
    }
  }

  if (hidden) {
    return null
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={[styles.wrapper, wrapperStyle]}>
      <Surface
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={[
          styles.container,
          {
            borderRadius: roundness,
            opacity: opacity,
            transform: [
              {
                scale: visible
                  ? opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                  : 1,
              },
            ],
          },
          { backgroundColor:variant === "isDisater"?colors.primary: ( variant === "error" ? colors.error : colors.success) },
          style,
        ]}
        {...rest}
      >
        <Icon
          style={{ marginHorizontal: 8 }}
          name={variant === "error" ? "close-octagon" :(variant=== "isDisater"? "home": "check-circle" )}
          size={25}
          color={"#fff"}
        />
        <Text style={styles.content}>{children}</Text>
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    width: "90%",
    display: "flex",
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingLeft: 8,
  },
  content: {
    marginLeft: 8,
    marginRight: 16,
    marginVertical: 14,
    flexWrap: "wrap",
    color: "#fff",
  },
})

/**
 * Show the Snackbar for a short duration.
 */
Snackbar.DURATION_SHORT = DURATION_SHORT

/**
 * Show the Snackbar for a medium duration.
 */
Snackbar.DURATION_MEDIUM = DURATION_MEDIUM

/**
 * Show the Snackbar for a long duration.
 */
Snackbar.DURATION_LONG = DURATION_LONG

export default Snackbar
