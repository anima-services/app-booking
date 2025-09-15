import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import CurrentDate from './CurrentDate';
import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useTheme } from './ThemeContext';

const Background = ({ isBusy }) => {
  const { theme, toggleTheme } = useTheme();
  const sizes = useResponsiveSizes();

  // Вычисляем marginSize на основе высоты экрана из хука
  const marginSize = sizes.windowHeight * .01;

  // Пересчитываем размеры на основе данных из хука
  const logoHeight = marginSize * 4;
  const logoWidth = logoHeight * 47 / 13;

  const hexPath = "M0 20C0 8.9543 8.95431 0 20 0H312.5H462.75C473.796 0 482.75 8.95431 482.75 20V21C482.75 32.0457 491.704 41 502.75 41H605C616.046 41 625 49.9543 625 61V380V760C625 771.046 616.046 780 605 780H20C8.95431 780 0 771.046 0 760V20Z";
  const verticalTopHexPath = "M0 30C0 13.4315 13.4315 0 30 0H402.25C416.333 0 427.75 11.4167 427.75 25.5C427.75 39.5833 439.167 51 453.25 51H570H687C701.083 51 712.5 39.5833 712.5 25.5C712.5 11.4167 723.917 0 738 0H1110C1126.57 0 1140 13.4315 1140 30L1140 890C1140 906.569 1126.57 920 1110 920H569.541H30C13.4315 920 0 906.569 0 890V30Z";
  const verticalBottomHexPath = "M0 890C0 906.568 13.4314 920 30 920L570 920L1110 920C1126.57 920 1140 906.568 1140 890V29.9999C1140 13.4314 1126.57 0 1110 0H625.577L29.985 0.297363C13.4223 0.305603 0 13.7347 0 30.2974V890Z";

  return (
    <View style={[styles.container, {
      backgroundColor: isBusy ? theme.busy : theme.free,
      flexDirection: sizes.type === 'landscape' ? 'row' : 'column',
    }]}>
      {/* Левая колонка */}
      <View style={[styles.column, { margin: marginSize, marginRight: marginSize * (sizes.type === 'landscape' ? .5 : 1) }]}>
        <View style={styles.hexContainer}>
          <Svg
            width="100%"
            height="100%"
            viewBox={sizes.type === 'landscape' ? "0 0 625 780" : "0 0 1140 920"}
            preserveAspectRatio="none"
          >
            <Path d={sizes.type === 'landscape' ? hexPath : verticalTopHexPath} fill={theme.dark} />
          </Svg>
        </View>
      </View>

      {/* Правая колонка */}
      <View style={[styles.column, { margin: marginSize, marginLeft: marginSize * (sizes.type === 'landscape' ? .5 : 1) }]}>
        <View style={styles.hexContainer}>
          <Svg
            width="100%"
            height="100%"
            viewBox={sizes.type === 'landscape' ? "0 0 625 780" : "0 0 1140 920"}
            preserveAspectRatio="none"
            style={{ transform: [{ scaleX: -1 }] }}
          >
            <Path d={sizes.type === 'landscape' ? hexPath : verticalBottomHexPath} fill={theme.dark} />
          </Svg>
        </View>
      </View>

      {/* Статус по центру */}
      <View style={[styles.statusbar, {
        top: marginSize*.5,
        height: marginSize * (sizes.type === 'landscape' ? 6.25 : 4),
      }]}>
        <View style={{
          width: marginSize * (sizes.type === 'landscape' ? 2 : 1.5),
          height: marginSize * (sizes.type === 'landscape' ? 2 : 1.5),
          borderRadius: marginSize * 1,
          backgroundColor: isBusy ? theme.light : theme.dark,
          marginRight: (sizes.type === 'landscape' ? 8 : 6),
        }} />
        <Text style={[styles.statusText, {
          fontSize: marginSize * (sizes.type === 'landscape' ? 3 : 2),
          color: isBusy ? theme.light : theme.dark
        }]}>{isBusy ? "Занято" : "Свободно"}</Text>
      </View>

      {/* Логотип */}
      <View style={{
        position: "absolute",
        top: marginSize * 3,
        left: marginSize * 4,
        width: logoWidth,
        height: logoHeight
      }}>
        <Svg width="100%" height="100%" viewBox="0 0 47 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M34.1471 4.25391C32.7895 4.25391 31.8049 4.84418 31.1438 5.71305C30.5831 4.83119 29.5985 4.25391 28.2409 4.25391C27.0698 4.25391 26.221 4.72612 25.7299 5.31639V4.47467H24.2695V12.2816H25.7299V8.14024V7.72823C25.7311 7.14168 25.965 6.57958 26.3802 6.16526C26.7954 5.75095 27.358 5.51826 27.9445 5.51826C28.0207 5.51801 28.0967 5.52195 28.1724 5.53007H28.1995C28.2657 5.53833 28.3318 5.54778 28.3955 5.56076H28.4038C28.5456 5.59047 28.684 5.63437 28.817 5.6918C29.2155 5.86259 29.5551 6.1466 29.7937 6.5086C30.0323 6.8706 30.1594 7.29467 30.1592 7.72823V12.2769H31.6184V9.05044V7.74122C31.6184 7.15166 31.8526 6.58624 32.2695 6.16935C32.6864 5.75247 33.2518 5.51826 33.8413 5.51826C34.4309 5.51826 34.9963 5.75247 35.4132 6.16935C35.8301 6.58624 36.0643 7.15166 36.0643 7.74122V12.2816H37.5234V7.63143C37.5246 5.66229 36.2685 4.25391 34.1471 4.25391Z" fill={theme.light} />
          <Path d="M20.89 4.47134C20.4972 4.47134 20.1133 4.35488 19.7868 4.13669C19.4602 3.9185 19.2057 3.60838 19.0554 3.24555C18.9052 2.88272 18.8658 2.48347 18.9425 2.09828C19.0191 1.7131 19.2082 1.35929 19.4859 1.08159C19.7636 0.803889 20.1174 0.614772 20.5026 0.538155C20.8878 0.461538 21.287 0.50086 21.6498 0.651151C22.0127 0.801441 22.3228 1.05595 22.541 1.38249C22.7592 1.70903 22.8756 2.09294 22.8756 2.48567C22.875 3.01211 22.6656 3.51681 22.2934 3.88906C21.9211 4.26131 21.4164 4.47071 20.89 4.47134ZM20.89 1.44915C20.6847 1.44915 20.484 1.51004 20.3133 1.62412C20.1427 1.7382 20.0097 1.90033 19.9311 2.09001C19.8526 2.2797 19.8322 2.4884 19.8723 2.68973C19.9124 2.89105 20.0114 3.07595 20.1566 3.22103C20.3019 3.3661 20.4869 3.46484 20.6882 3.50475C20.8896 3.54465 21.0983 3.52394 21.2879 3.44521C21.4775 3.36649 21.6395 3.2333 21.7534 3.0625C21.8672 2.8917 21.9279 2.69095 21.9277 2.48567C21.9273 2.21066 21.8179 1.94702 21.6233 1.75267C21.4287 1.55832 21.165 1.44915 20.89 1.44915Z" fill={theme.light} />
          <Path d="M4.11761 4.25391C2.13902 4.25391 0.771957 5.50882 0.593695 6.74839H1.90291C2.25708 6.0684 2.98193 5.61153 4.11761 5.61153C5.81994 5.61153 6.3441 6.35881 6.3441 7.37643H3.86497C2.0493 7.37643 0.441406 8.00448 0.441406 9.90515C0.441406 11.6535 1.7825 12.5023 3.61588 12.5023C4.83774 12.5023 5.7196 12.095 6.33112 11.4328V12.2816H7.79026V7.37407C7.79026 5.61507 6.68056 4.25391 4.11761 4.25391ZM6.33112 9.15787C6.33112 10.329 5.34655 11.1447 3.76817 11.1447C2.63131 11.1447 1.90173 10.7705 1.90173 9.90515C1.90173 9.03981 2.63131 8.64906 3.85316 8.64906H6.3323L6.33112 9.15787Z" fill={theme.light} />
          <Path d="M43.2566 4.25391C41.2781 4.25391 39.911 5.50882 39.7339 6.74839H41.0419C41.3961 6.0684 42.121 5.61153 43.2566 5.61153C44.959 5.61153 45.4831 6.35881 45.4831 7.37643H43.0075C41.1907 7.37643 39.584 8.00448 39.584 9.90515C39.584 11.6535 40.9239 12.5023 42.7573 12.5023C43.9791 12.5023 44.8622 12.095 45.4725 11.4328V12.2816H46.9281V7.37407C46.9281 5.61507 45.8172 4.25391 43.2566 4.25391ZM45.4702 9.15787C45.4702 10.329 44.4856 11.1447 42.9072 11.1447C41.7703 11.1447 41.0408 10.7705 41.0408 9.90515C41.0408 9.03981 41.7703 8.64906 42.9922 8.64906H45.4713L45.4702 9.15787Z" fill={theme.light} />
          <Path d="M14.4253 4.25391C13.2035 4.25391 12.3216 4.69543 11.7951 5.31639V4.47467H10.3359V12.2816H11.7951V8.22524C11.7951 8.20517 11.7951 8.18628 11.7951 8.16739V7.84629C11.7951 7.83094 11.7951 7.81559 11.7951 7.80025C11.7951 7.7849 11.7951 7.77073 11.7951 7.75539V7.74358C11.7951 7.72823 11.7951 7.71407 11.7951 7.6999C11.8175 7.19115 12.0095 6.70453 12.3405 6.31749C12.3523 6.30332 12.3653 6.29034 12.3771 6.27735C12.4066 6.2443 12.4373 6.21242 12.4692 6.18055L12.5365 6.1168C12.5577 6.09673 12.5813 6.07666 12.6038 6.05777C12.6262 6.03888 12.6616 6.00937 12.6923 5.98576L12.736 5.95388C13.0765 5.70757 13.4783 5.56005 13.8973 5.5276C14.3163 5.49516 14.7361 5.57904 15.1105 5.76999C15.4848 5.96095 15.7992 6.25157 16.0189 6.60982C16.2385 6.96806 16.355 7.38001 16.3555 7.80025V12.2863H17.8147V7.68219C17.8194 5.69653 16.5645 4.25391 14.4253 4.25391Z" fill={theme.light} />
        </Svg>
      </View>

      {/* Дата и время */}
      <CurrentDate style={{
        position: "absolute",
        top: marginSize * 3,
        right: marginSize * 4,
      }} />
    </View>
  );
};

// Стили остаются без изменений
const styles = StyleSheet.create({
  statusbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusText: {
    fontFamily: "Onest_500Medium",
  },
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: -1,
    position: 'absolute',
  },
  column: {
    flex: 1,
  },
  hexContainer: {
    width: '100%',
    position: 'relative',
  },
});

export default Background;