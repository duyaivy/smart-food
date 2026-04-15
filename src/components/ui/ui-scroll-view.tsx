import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function UIScrollView(props: ScrollViewProps) {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.keyboard}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView {...props} />
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  keyboard: {
    flexGrow: 1,
  },
});
