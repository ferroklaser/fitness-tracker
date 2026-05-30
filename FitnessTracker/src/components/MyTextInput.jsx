import { TextInput, StyleSheet } from "react-native"

const MyTextInput = ({...props}) => {
    return (
        <TextInput {...props} style={[styles.input, props.style]}/>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
    },
})

export default MyTextInput