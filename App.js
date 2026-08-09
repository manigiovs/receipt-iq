import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

const NAVY = "#0D0B3D";
const DARK = "#202027";
const GREEN = "#19B394";
const LIGHT = "#E8E8E8";
const WHITE = "#FFFFFF";
const GRAY = "#888888";

export default function App() {
  const [page, setPage] = useState("signin");
  const [menuOpen, setMenuOpen] = useState(false);

  const slide = useRef(new Animated.Value(0)).current;

  const changePage = (nextPage) => {
    setMenuOpen(false);

    Animated.timing(slide, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPage(nextPage);
      slide.setValue(-1);

      Animated.timing(slide, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const animatedStyle = {
    transform: [
      {
        translateX: slide.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-width, 0, width],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.screen, animatedStyle]}>
        {page === "signin" && (
          <SignIn
            go={changePage}
          />
        )}

        {page === "signup" && (
          <CreateAccount
            go={changePage}
          />
        )}

        {page === "setup" && (
          <Setup
            go={changePage}
          />
        )}

        {page === "dashboard" && (
          <Dashboard
            go={changePage}
            openMenu={() => setMenuOpen(true)}
          />
        )}

        {page === "records" && (
          <Records
            go={changePage}
            openMenu={() => setMenuOpen(true)}
          />
        )}

        {page === "profile" && (
          <Profile
            go={changePage}
            openMenu={() => setMenuOpen(true)}
          />
        )}

        {page === "report" && (
          <Report
            go={changePage}
            openMenu={() => setMenuOpen(true)}
          />
        )}
      </Animated.View>

      {menuOpen && (
        <SideMenu
          go={changePage}
          closeMenu={() => setMenuOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ openMenu }) {
  return (
    <View style={styles.header}>
      <Text style={styles.menuIcon} onPress={openMenu}>
        ☰
      </Text>

      <View style={styles.statusRight}>
        <Text style={styles.statusText}>● ● ▰</Text>
      </View>
    </View>
  );
}

/* =========================================================
   SIGN IN
========================================================= */

function SignIn({ go }) {
  return (
    <View style={styles.fullDark}>
      <Header openMenu={() => {}} />

      <View style={styles.topWelcome}>
        <View style={styles.smallSquare} />

        <Text style={styles.welcomeText}>
          Welcome Back.
        </Text>

        <Text style={styles.welcomeSub}>
          Good To See You Again.
        </Text>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.formTitle}>SIGN IN</Text>

        <Text style={styles.formDescription}>
          Enter your details to continue.
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="username@email.com"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#777"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.greenButton}
          onPress={() => go("setup")}
        >
          <Text style={styles.greenButtonText}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => go("signup")}>
          <Text style={styles.accountText}>
            New here? Create an Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   CREATE ACCOUNT
========================================================= */

function CreateAccount({ go }) {
  return (
    <View style={styles.fullDark}>
      <Header openMenu={() => {}} />

      <View style={styles.topWelcome}>
        <View style={styles.smallSquare} />

        <Text style={styles.welcomeText}>
          Join Us.
        </Text>

        <Text style={styles.welcomeSub}>
          Start Something New{"\n"}Today.
        </Text>
      </View>

      <ScrollView
        style={styles.formBox}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.formTitle}>
          CREATE ACCOUNT
        </Text>

        <Text style={styles.formDescription}>
          Enter your details to continue.
        </Text>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="username@email.com"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#777"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.greenButton}
          onPress={() => go("setup")}
        >
          <Text style={styles.greenButtonText}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => go("signin")}>
          <Text style={styles.accountText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   SETUP SCREEN
========================================================= */

function Setup({ go }) {
  return (
    <View style={styles.setupScreen}>
      <View style={styles.setupTop}>
        <Header openMenu={() => {}} />

        <View style={styles.setupTitleContainer}>
          <Text style={styles.setupTitle}>
            You’re In.
          </Text>

          <Text style={styles.setupTitle}>
            Let’s Get You Set Up.
          </Text>
        </View>
      </View>

      <View style={styles.setupBottom}>
        <Text style={styles.setupWelcome}>
          WELCOME, User
        </Text>

        <Text style={styles.setupDescription}>
          Your account is ready. Here's a quick{"\n"}
          look at what you can do first
        </Text>

        <TouchableOpacity style={styles.setupCard}>
          <View style={styles.circleIcon}>
            <Text style={styles.iconText}>♙</Text>
          </View>

          <View>
            <Text style={styles.setupCardTitle}>
              Complete your profile
            </Text>

            <Text style={styles.setupCardSub}>
              Add Profile Photo
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setupCard}>
          <View style={styles.circleIcon}>
            <Text style={styles.iconText}>⚙</Text>
          </View>

          <View>
            <Text style={styles.setupCardTitle}>
              Set Your Preferences
            </Text>

            <Text style={styles.setupCardSub}>
              Tailor it to how you work
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => go("dashboard")}
        >
          <Text style={styles.dashboardButtonText}>
            Go to Dashboard
          </Text>
        </TouchableOpacity>

        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ go, openMenu }) {
  return (
    <View style={styles.dashboardScreen}>
      <View style={styles.dashboardHeader}>
        <Header openMenu={openMenu} />

        <Text style={styles.dashboardWelcome}>
          Welcome back,
        </Text>

        <Text style={styles.userName}>
          User
        </Text>

        <Text style={styles.balanceLabel}>
          TOTAL BALANCE
        </Text>

        <Text style={styles.balance}>
          ₱ 12,480
          <Text style={styles.decimal}>.50</Text>
        </Text>

        <View style={styles.profileCircle}>
          <Text style={styles.profileIcon}>●</Text>
        </View>
      </View>

      <View style={styles.dashboardBody}>

        {/* SCAN BUTTON */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => go("records")}
        >
          <Text style={styles.scanArrow}>↑</Text>
        </TouchableOpacity>

        <Text style={styles.scanText}>
          Scan
        </Text>

        {/* SPENDING BREAKDOWN */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>
              Spending Breakdown
            </Text>

            <Text style={styles.monthText}>
              This Month
            </Text>
          </View>

          <View style={styles.chartRow}>
            <View style={styles.donut}>
              <View style={styles.donutInner}>
                <Text style={styles.spentSmall}>
                  SPENT
                </Text>

                <Text style={styles.spentAmount}>
                  $1,240
                </Text>
              </View>
            </View>

            <View style={styles.legend}>
              <Legend color="#19A982" text="Shopping" />
              <Legend color="#278FEA" text="Food & Dining" />
              <Legend color="#FF9D00" text="Entertainment" />
              <Legend color="#A746DC" text="Transport" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Legend({ color, text }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.legendText}>
        {text}
      </Text>
    </View>
  );
}

/* =========================================================
   RECORDS
========================================================= */

function Records({ go, openMenu }) {
  return (
    <View style={styles.recordsScreen}>
      <View style={styles.recordsHeader}>
        <Header openMenu={openMenu} />
      </View>

      <View style={styles.recordsBody}>

        <TouchableOpacity
          style={styles.recordsButton}
          onPress={() => alert("Take Photo")}
        >
        <Text style={styles.uploadIcon}>
            📷
          </Text>

          <Text style={styles.recordsButtonText}>
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordsButton}
          onPress={() => alert("Upload Photo")}
        >
         <Text style={styles.uploadIcon}>
            🖼
          </Text>
          
          <Text style={styles.recordsButtonText}>
            Upload Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordsButton}
          onPress={() => alert("Add Manual Receipt")}
        >
          <Text style={styles.recordsButtonText}>
            Add Manual Receipt
          </Text>
        </TouchableOpacity>

        <Text style={styles.recentTitle}>
          Recent Uploads
        </Text>

        <View style={styles.uploadHeader}>
          <Text style={styles.uploadHeaderText}>
            Picture
          </Text>

          <Text style={styles.uploadHeaderText}>
            Transaction No.
          </Text>

          <Text style={styles.uploadHeaderText}>
            DATE
          </Text>
        </View>

        <UploadRow number="001" date="08/09/26" />
        <UploadRow number="002" date="08/08/26" />
        <UploadRow number="003" date="08/07/26" />
      </View>
    </View>
  );
}

function UploadRow({ number, date }) {
  return (
    <View style={styles.uploadRow}>
      <View style={styles.pictureBox}>
        <Text style={styles.pictureText}>
          Picture
        </Text>
      </View>

      <Text style={styles.transactionText}>
        {number}
      </Text>

      <Text style={styles.dateText}>
        {date}
      </Text>
    </View>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function Profile({ go, openMenu }) {
  return (
    <View style={styles.profileScreen}>
      <View style={styles.profileHeader}>
        <Header openMenu={openMenu} />
      </View>

      <View style={styles.profileBody}>
        <View style={styles.bigProfileCircle}>
          <Text style={styles.bigProfileIcon}>
            ●
          </Text>
        </View>

        <Text style={styles.profileName}>
          User
        </Text>

        <Text style={styles.profileEmail}>
          username@email.com
        </Text>

        <TouchableOpacity style={styles.profileButton}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Text>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Text>Security</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   REPORT
========================================================= */

function Report({ openMenu }) {
  return (
    <View style={styles.reportScreen}>
      <View style={styles.reportHeader}>
        <Header openMenu={openMenu} />
      </View>

      <View style={styles.reportBody}>
        <Text style={styles.reportTitle}>
          Spending Report
        </Text>

        <View style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>
            Monthly Spending
          </Text>

          <Text style={styles.reportAmount}>
            ₱1,240
          </Text>

          <Text style={styles.reportDescription}>
            Your spending summary for this month.
          </Text>
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   SIDE MENU
========================================================= */

function SideMenu({ go, closeMenu }) {
  return (
    <View style={styles.menuOverlay}>

      <TouchableOpacity
        style={styles.menuBackground}
        onPress={closeMenu}
      />

      <View style={styles.sideMenu}>

        <View style={styles.sideMenuTop}>
          <Text
            style={styles.closeMenu}
            onPress={closeMenu}
          >
            ×
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => go("dashboard")}
        >
          <Text style={styles.menuButtonText}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => go("records")}
        >
          <Text style={styles.menuButtonText}>
            Records
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => go("report")}
        >
          <Text style={styles.menuButtonText}>
            Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => go("profile")}
        >
          <Text style={styles.menuButtonText}>
            Profile
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => go("signin")}
        >
          <Text style={styles.menuButtonText}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NAVY,
  },

  screen: {
    flex: 1,
  },

  fullDark: {
    flex: 1,
    backgroundColor: NAVY,
  },

  header: {
    height: 65,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuIcon: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "300",
  },

  statusRight: {
    position: "absolute",
    right: 20,
    top: 25,
  },

  statusText: {
    color: WHITE,
    fontSize: 10,
  },

  topWelcome: {
    paddingHorizontal: 30,
    paddingTop: 55,
    flex: 1,
  },

  smallSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#222245",
    marginBottom: 20,
  },

  welcomeText: {
    color: WHITE,
    fontSize: 20,
  },

  welcomeSub: {
    color: WHITE,
    fontSize: 18,
    marginTop: 3,
    lineHeight: 22,
  },

  formBox: {
    backgroundColor: DARK,
    paddingHorizontal: 24,
    paddingTop: 18,
    minHeight: 360,
  },

  formTitle: {
    color: WHITE,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "bold",
    fontFamily: "serif",
  },

  formDescription: {
    color: "#777",
    textAlign: "center",
    fontSize: 9,
    marginTop: 5,
    marginBottom: 22,
  },

  label: {
    color: WHITE,
    fontSize: 9,
    marginBottom: 5,
  },

  input: {
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: "#777",
    color: WHITE,
    marginBottom: 15,
    fontSize: 12,
  },

  greenButton: {
    backgroundColor: GREEN,
    height: 38,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  greenButtonText: {
    color: NAVY,
    fontSize: 12,
  },

  accountText: {
    color: WHITE,
    textAlign: "center",
    fontSize: 8,
    marginTop: 12,
  },

  /* SETUP */

  setupScreen: {
    flex: 1,
    backgroundColor: DARK,
  },

  setupTop: {
    height: "45%",
    backgroundColor: NAVY,
  },

  setupTitleContainer: {
    paddingHorizontal: 32,
    marginTop: 75,
  },

  setupTitle: {
    color: WHITE,
    fontSize: 27,
    lineHeight: 36,
  },

  setupBottom: {
    flex: 1,
    backgroundColor: DARK,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 25,
  },

  setupWelcome: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "serif",
  },

  setupDescription: {
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 20,
  },

  setupCard: {
    width: "90%",
    height: 72,
    backgroundColor: NAVY,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  circleIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  iconText: {
    color: WHITE,
    fontSize: 24,
  },

  setupCardTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "bold",
  },

  setupCardSub: {
    color: "#999",
    fontSize: 12,
    marginTop: 3,
  },

  dashboardButton: {
    width: "90%",
    height: 48,
    backgroundColor: GREEN,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  dashboardButtonText: {
    color: NAVY,
    fontSize: 16,
  },

  homeIndicator: {
    width: 130,
    height: 4,
    backgroundColor: WHITE,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
  },

  /* DASHBOARD */

  dashboardScreen: {
    flex: 1,
    backgroundColor: "#E7E7E7",
  },

  dashboardHeader: {
    height: 250,
    backgroundColor: NAVY,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 25,
  },

  dashboardWelcome: {
    color: "#B7B5D0",
    fontSize: 12,
    marginTop: 8,
  },

  userName: {
    color: WHITE,
    fontSize: 21,
    fontWeight: "bold",
  },

  balanceLabel: {
    color: "#A6A4C0",
    fontSize: 10,
    marginTop: 20,
  },

  balance: {
    color: WHITE,
    fontSize: 32,
    fontWeight: "bold",
  },

  decimal: {
    color: "#AAA9C9",
    fontSize: 16,
  },

  profileCircle: {
    position: "absolute",
    right: 28,
    top: 70,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    color: "#888",
    fontSize: 25,
  },

  dashboardBody: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
  },

  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },

  scanArrow: {
    color: WHITE,
    fontSize: 25,
  },

  scanText: {
    color: "#111",
    fontSize: 10,
    marginTop: 2,
    marginBottom: 25,
  },

  breakdownCard: {
    width: "82%",
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 18,
    elevation: 4,
  },

  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  breakdownTitle: {
    color: "#111",
    fontSize: 15,
    fontWeight: "bold",
  },

  monthText: {
    color: "#111",
    fontSize: 12,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  donut: {
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 20,
    borderTopColor: "#19A982",
    borderRightColor: "#278FEA",
    borderBottomColor: "#FF9D00",
    borderLeftColor: "#A746DC",
    alignItems: "center",
    justifyContent: "center",
  },

  donutInner: {
    alignItems: "center",
  },

  spentSmall: {
    fontSize: 9,
    color: "#999",
  },

  spentAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },

  legend: {
    marginLeft: 18,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 7,
  },

  legendText: {
    fontSize: 11,
    color: "#222",
  },

  /* RECORDS */

  recordsScreen: {
    flex: 1,
    backgroundColor: "#E7E7E7",
  },

  recordsHeader: {
    height: 115,
    backgroundColor: NAVY,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  recordsBody: {
    paddingHorizontal: 25,
    paddingTop: 35,
  },

  recordsButton: {
    height: 54,
    backgroundColor: NAVY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  recordsButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "bold",
  },

  recentTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 18,
  },

  uploadHeader: {
    height: 53,
    backgroundColor: NAVY,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  uploadHeaderText: {
    color: WHITE,
    fontSize: 8,
    fontWeight: "bold",
  },

  uploadRow: {
    height: 53,
    backgroundColor: NAVY,
    borderRadius: 15,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  pictureBox: {
    width: 55,
  },

  pictureText: {
    color: WHITE,
    fontSize: 8,
  },

  transactionText: {
    color: WHITE,
    fontSize: 8,
  },

  dateText: {
    color: WHITE,
    fontSize: 8,
  },

  /* PROFILE */

  profileScreen: {
    flex: 1,
    backgroundColor: DARK,
  },

  profileHeader: {
    backgroundColor: NAVY,
    height: 85,
  },

  profileBody: {
    alignItems: "center",
    paddingTop: 25,
  },

  bigProfileCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },

  bigProfileIcon: {
    color: "#888",
    fontSize: 38,
  },

  profileName: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },

  profileEmail: {
    color: "#777",
    fontSize: 9,
    marginBottom: 25,
  },

  profileButton: {
    width: "75%",
    height: 42,
    backgroundColor: WHITE,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  /* REPORT */

  reportScreen: {
    flex: 1,
    backgroundColor: "#E7E7E7",
  },

  reportHeader: {
    height: 100,
    backgroundColor: NAVY,
  },

  reportBody: {
    padding: 25,
  },

  reportTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },

  reportCard: {
    marginTop: 25,
    backgroundColor: WHITE,
    padding: 25,
    borderRadius: 15,
  },

  reportCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  reportAmount: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 15,
  },

  reportDescription: {
    color: GRAY,
    marginTop: 10,
  },

  /* SIDE MENU */

  menuOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
  },

  menuBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sideMenu: {
    width: width * 0.55,
    backgroundColor: NAVY,
    paddingTop: 40,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  sideMenuTop: {
    height: 45,
  },

  closeMenu: {
    color: WHITE,
    fontSize: 28,
  },

  menuButton: {
    height: 43,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  menuButtonText: {
    color: "#111",
    fontSize: 10,
    fontWeight: "bold",
  },

  logoutButton: {
    height: 43,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});