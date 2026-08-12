import React, { useRef, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

/* =====================================================
   COLORS
===================================================== */

const NAVY = "#0D0D32";
const BG = "#E5E5E5";
const DARK = "#22222B";
const GREEN = "#209B7F";
const WHITE = "#FFFFFF";
const RED = "#FF5C65";
const GRAY = "#777780";


/* =====================================================
   APP
===================================================== */

export default function App() {

  const [screen, setScreen] = useState("login");
  const [drawerOpen, setDrawerOpen] = useState(false);

  /*
   * SIDEBAR ANIMATION
   *
   * 0 = closed
   * 1 = opened
   */

  const drawerAnimation = useRef(
    new Animated.Value(0)
  ).current;


  /* =====================================================
     OPEN SIDEBAR
  ===================================================== */

  const openDrawer = () => {

    setDrawerOpen(true);

    Animated.spring(drawerAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();

  };


  /* =====================================================
     CLOSE SIDEBAR
  ===================================================== */

  const closeDrawer = () => {

    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {

      setDrawerOpen(false);

    });

  };


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navigate = (page) => {

    closeDrawer();

    setScreen(page);

  };


  /* =====================================================
     SIDEBAR
  ===================================================== */

  const Sidebar = () => {

    if (!drawerOpen) {
      return null;
    }

    /*
     * Sidebar moves from -300 → 0
     */

    const drawerTranslateX =
      drawerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-320, 0],
      });


    /*
     * Background becomes darker
     */

    const overlayOpacity =
      drawerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.45],
      });


    return (
      <View style={styles.drawerOverlay}>

        {/* =============================================
            DARK BACKGROUND
        ============================================= */}

        <Animated.View
          style={[
            styles.drawerBackdrop,
            {
              opacity: overlayOpacity,
            },
          ]}
        >

          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeDrawer}
          />

        </Animated.View>


        {/* =============================================
            SLIDING SIDEBAR
        ============================================= */}

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [
                {
                  translateX: drawerTranslateX,
                },
              ],
            },
          ]}
        >

          {/* SIDEBAR CLOSE */}

          <View style={styles.drawerTop}>

            <TouchableOpacity
              onPress={closeDrawer}
              style={styles.closeButton}
            >

              <Ionicons
                name="close"
                size={25}
                color={WHITE}
              />

            </TouchableOpacity>

          </View>


          {/* DASHBOARD */}

          <DrawerButton
            icon="grid-outline"
            title="Dashboard"
            onPress={() =>
              navigate("dashboard")
            }
          />


          {/* RECORDS */}

          <DrawerButton
            icon="receipt-outline"
            title="Records"
            onPress={() =>
              navigate("records")
            }
          />


          {/* REPORT */}

          <DrawerButton
            icon="bar-chart-outline"
            title="Report"
            onPress={() =>
              navigate("report")
            }
          />


          {/* PROFILE */}

          <DrawerButton
            icon="person-outline"
            title="Profile"
            onPress={() =>
              navigate("profile")
            }
          />


          {/* LOG OUT */}

          <DrawerButton 
            icon="log-out-outline"
            title="Log out"
            onPress={() =>
              navigate("login")
            }
          />

        </Animated.View>

      </View>
    );
  };


  /* =====================================================
     LOGIN
  ===================================================== */

  if (screen === "login") {

    return (
      <ScreenWrapper>

        {/* TOP */}

        <View style={styles.authTop}>

          <View style={styles.fakeLogo} />

          <TouchableOpacity
            style={styles.menuIcon}
            onPress={openDrawer}
          >

            <Ionicons
              name="menu-outline"
              size={28}
              color={WHITE}
            />

          </TouchableOpacity>


          <Text style={styles.authHeading}>

            Welcome Back.
            {"\n"}

            Good To See You Again.

          </Text>

        </View>


        {/* BOTTOM */}

        <View style={styles.authBottom}>

          <Text style={styles.authTitle}>
            SIGN IN
          </Text>


          <Text style={styles.authSubtitle}>
            Enter your details to continue.
          </Text>


          <Input
            label="Email"
            placeholder="username@email.com"
          />


          <Input
            label="Password"
            placeholder="••••••••••••"
            secure
          />


          <GreenButton
            title="Sign In"
            onPress={() =>
              setScreen("dashboard")
            }
          />


          <TouchableOpacity
            onPress={() =>
              setScreen("register")
            }
            style={styles.accountLink}
          >

            <Text style={styles.accountText}>

              New here?{" "}

              <Text
                style={{
                  fontWeight: "700",
                }}
              >
                Create an Account
              </Text>

            </Text>

          </TouchableOpacity>

        </View>


        <Sidebar />

      </ScreenWrapper>
    );
  }


  /* =====================================================
     REGISTER
  ===================================================== */

  if (screen === "register") {

    return (
      <ScreenWrapper>

        <View style={styles.authTop}>

          <View style={styles.fakeLogo} />


          <TouchableOpacity
            style={styles.menuIcon}
            onPress={openDrawer}
          >

            <Ionicons
              name="menu-outline"
              size={28}
              color={WHITE}
            />

          </TouchableOpacity>


          <Text style={styles.authHeading}>

            Join Us.
            {"\n"}

            Start Something New
            {"\n"}

            Today.

          </Text>

        </View>


        <ScrollView
          style={styles.authBottom}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >

          <Text style={styles.authTitle}>
            CREATE ACCOUNT
          </Text>


          <Text style={styles.authSubtitle}>
            Enter your details to continue.
          </Text>


          <Input
            label="Full Name"
            placeholder="Full Name"
          />


          <Input
            label="Email"
            placeholder="username@email.com"
          />


          <Input
            label="Password"
            placeholder="••••••••••••"
            secure
          />


          <GreenButton
            title="Sign In"
            onPress={() =>
              setScreen("setup")
            }
          />


          <TouchableOpacity
            onPress={() =>
              setScreen("login")
            }
            style={styles.accountLink}
          >

            <Text style={styles.accountText}>

              Already have an account?{" "}

              <Text
                style={{
                  fontWeight: "700",
                }}
              >
                Sign In
              </Text>

            </Text>

          </TouchableOpacity>

        </ScrollView>


        <Sidebar />

      </ScreenWrapper>
    );
  }


  /* =====================================================
     SETUP
  ===================================================== */

  if (screen === "setup") {

    return (
      <ScreenWrapper>

        <View style={styles.setupTop}>

          <Text style={styles.setupHeading}>

            You're In.
            {"\n"}

            Let's Get You Set Up.

          </Text>

        </View>


        <View style={styles.setupBottom}>

          <Text style={styles.authTitle}>
            WELCOME, User
          </Text>


          <Text style={styles.setupDescription}>

            Your account is ready. Here's a quick
            {"\n"}
            look at what you can do first.

          </Text>


          <SetupOption
            icon="person-outline"
            title="Complete your profile"
            subtitle="Add Profile Photo"
          />


          <SetupOption
            icon="settings-outline"
            title="Set Your Preferences"
            subtitle="Tailor it to how you work"
          />


          <GreenButton
            title="Go to Dashboard"
            onPress={() =>
              setScreen("dashboard")
            }
          />

        </View>

      </ScreenWrapper>
    );
  }


  /* =====================================================
     DASHBOARD
  ===================================================== */

  if (screen === "dashboard") {

    return (
      <ScreenWrapper>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >

          {/* HEADER */}

          <View style={styles.dashboardHeader}>

            <TouchableOpacity
              style={styles.dashboardMenu}
              onPress={openDrawer}
            >

              <Ionicons
                name="menu-outline"
                size={28}
                color={WHITE}
              />

            </TouchableOpacity>


            <View style={styles.avatar}>

              <Ionicons
                name="person"
                size={25}
                color="#777"
              />

            </View>


            <Text style={styles.welcomeSmall}>
              Welcome back,
            </Text>


            <Text style={styles.dashboardUser}>
              User
            </Text>


            <Text style={styles.balanceLabel}>
              TOTAL BALANCE
            </Text>


            <Text style={styles.balance}>

              ₱ 12,480

              <Text
                style={styles.balanceDecimal}
              >
                .50
              </Text>

            </Text>

          </View>


          {/* SCAN */}

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() =>
              setScreen("scan")
            }
          >

            <View style={styles.scanCircle}>

              <MaterialCommunityIcons
                name="qrcode-scan"
                size={34}
                color={WHITE}
              />

            </View>


            <Text style={styles.scanText}>
              Scan
            </Text>

          </TouchableOpacity>


          {/* SPENDING */}

          <SpendingCard />

        </ScrollView>


        <Sidebar />

      </ScreenWrapper>
    );
  }


  /* =====================================================
     SCAN HOME
  ===================================================== */

  if (screen === "scan") {

    return (
      <ScreenWrapper>

        <View style={styles.simpleHeader}>

          <TouchableOpacity
            onPress={openDrawer}
          >

            <Ionicons
              name="menu-outline"
              size={28}
              color={WHITE}
            />

          </TouchableOpacity>

        </View>


        <View style={styles.scanHome}>

          <DarkButton
            title="Take Photo"
            onPress={() =>
              setScreen("camera")
            }
          />


          <DarkButton
            title="Upload Photo"
            onPress={() =>
              setScreen("review")
            }
          />


          <DarkButton
            title="Add Manual Receipt"
            onPress={() =>
              setScreen("review")
            }
          />


          <Text style={styles.recentTitle}>
            Recent Uploads
          </Text>


          <RecentUpload />
          <RecentUpload />
          <RecentUpload />

        </View>


        <Sidebar />

      </ScreenWrapper>
    );
  }


  /* =====================================================
     CAMERA
  ===================================================== */

  if (screen === "camera") {

    return (
      <View style={styles.cameraScreen}>

        <StatusBar
          barStyle="light-content"
        />


        <View style={styles.cameraHeader}>

          <TouchableOpacity
            onPress={() =>
              setScreen("scan")
            }
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color={WHITE}
            />

          </TouchableOpacity>


          <Text style={styles.cameraTitle}>
            Camera Scan
          </Text>


          <Ionicons
            name="settings-outline"
            size={23}
            color={WHITE}
          />

        </View>


        {/* CAMERA FRAME */}

        <View style={styles.cameraFrame}>

          <View style={styles.receiptPreview}>

            <Text style={styles.receiptStore}>
              STARBUCKS COFFEE
            </Text>


            <Text style={styles.receiptSmall}>
              123 Broadway, New York, NY
            </Text>


            <View style={styles.receiptLine} />


            <Text style={styles.receiptCenter}>
              CASH RECEIPT
            </Text>


            <ReceiptItem
              name="Caffe Latte"
              price="4.75"
            />


            <ReceiptItem
              name="Iced Caramel Macch"
              price="5.25"
            />


            <ReceiptItem
              name="Avocado Toast Slice"
              price="12.50"
            />


            <ReceiptItem
              name="Warm Butter Croissant"
              price="3.00"
            />


            <View style={styles.receiptLine} />


            <Text style={styles.receiptTotal}>
              TOTAL                 $25.50
            </Text>


            <Text style={styles.thankYou}>
              THANK YOU!
            </Text>

          </View>

        </View>


        <Text style={styles.alignText}>
          Align receipt within the frame to scan
        </Text>


        {/* CAMERA BUTTONS */}

        <View style={styles.cameraActions}>

          <TouchableOpacity
            style={styles.cameraActionButton}
            onPress={() =>
              setScreen("scan")
            }
          >

            <Ionicons
              name="close-circle-outline"
              size={18}
              color={WHITE}
            />

            <Text style={styles.cameraActionText}>
              Retake Scan
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.deleteScan}
            onPress={() =>
              setScreen("scan")
            }
          >

            <Ionicons
              name="trash-outline"
              size={18}
              color={RED}
            />

            <Text style={styles.deleteText}>
              Delete Scan
            </Text>

          </TouchableOpacity>

        </View>


        {/* CAMERA BOTTOM */}

        <View style={styles.cameraBottom}>

          <TouchableOpacity
            style={styles.roundIcon}
          >

            <Ionicons
              name="images-outline"
              size={22}
              color={WHITE}
            />

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.shutter}
            onPress={() =>
              setScreen("review")
            }
          >

            <View style={styles.shutterInner} />

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.roundIcon}
          >

            <Ionicons
              name="document-text-outline"
              size={22}
              color={WHITE}
            />

          </TouchableOpacity>

        </View>

      </View>
    );
  }


  /* =====================================================
     REVIEW
  ===================================================== */

  if (screen === "review") {

    return (
      <ScreenWrapper>

        <View style={styles.reviewHeader}>

          <TouchableOpacity
            onPress={() =>
              setScreen("scan")
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={WHITE}
            />

          </TouchableOpacity>


          <Text style={styles.reviewTitle}>
            Review Details
          </Text>


          <Ionicons
            name="help-circle-outline"
            size={22}
            color={WHITE}
          />


          <Text style={styles.reviewSubtitle}>
            Confirm extracted receipt data below.
          </Text>

        </View>


        <ScrollView
          style={styles.reviewBody}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >

          {/* EXTRACTED RECEIPT */}

          <View style={styles.extractedCard}>

            <Ionicons
              name="document-text-outline"
              size={28}
              color="#20BDB4"
            />


            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#20BDB4"
              style={{
                position: "absolute",
                right : 90,
                top: 10,
              }}
            />


            <Text style={styles.storeName}>
              Starbucks
            </Text>


            <Text style={styles.extractedAmount}>
              $25.50
            </Text>


            <Text style={styles.extractedText}>

              We've extracted your info — make changes if
              {"\n"}
              needed.

            </Text>

          </View>


          <ReviewRow
            icon="close-circle-outline"
            label="Merchant"
            value="Starbucks"
          />


          <ReviewRow
            icon="calendar-outline"
            label="Date"
            value="Aug 2, 2025"
          />


          <ReviewRow
            icon="card-outline"
            label="Total"
            value="$25.50"
          />


          <ReviewRow
            icon="card-outline"
            label="Payment Method"
            value="Visa •••• 5643"
          />


          <ReviewRow
            icon="grid-outline"
            label="Category"
            value="Food & Beverage"
            dropdown
          />


          <DarkButton
            title="✓  Confirm & Save Expense"
            onPress={() =>
              setScreen("dashboard")
            }
          />


          {/* EDIT / DELETE */}

          <View style={styles.editDeleteRow}>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                setScreen("edit")
              }
            >

              <Ionicons
                name="create-outline"
                size={16}
                color={NAVY}
              />

              <Text style={styles.editText}>
                Edit
              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                setScreen("scan")
              }
            >

              <Ionicons
                name="trash-outline"
                size={16}
                color={RED}
              />

              <Text style={styles.deleteText}>
                Delete
              </Text>

            </TouchableOpacity>

          </View>

        </ScrollView>

      </ScreenWrapper>
    );
  }


  /* =====================================================
     EDIT
  ===================================================== */

  if (screen === "edit") {

    return (
      <ScreenWrapper>

        <View style={styles.simpleHeader}>

          <TouchableOpacity
            onPress={() =>
              setScreen("review")
            }
          >

            <Ionicons
              name="arrow-back"
              size={26}
              color={WHITE}
            />

          </TouchableOpacity>


          <Text style={styles.editHeaderTitle}>
            Edit Receipt
          </Text>

        </View>


        <ScrollView
          style={{
            padding: 20,
          }}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >

          <EditInput
            label="Merchant"
            value="Starbucks"
          />


          <EditInput
            label="Date"
            value="Aug 2, 2025"
          />


          <EditInput
            label="Total"
            value="$25.50"
          />


          <EditInput
            label="Payment Method"
            value="Visa •••• 5643"
          />


          <EditInput
            label="Category"
            value="Food & Beverage"
          />


          <DarkButton
            title="Save Changes"
            onPress={() =>
              setScreen("review")
            }
          />

        </ScrollView>

      </ScreenWrapper>
    );
  }


  /* =====================================================
     RECORDS / REPORT / PROFILE
  ===================================================== */

  return (
    <ScreenWrapper>

      <View style={styles.simpleHeader}>

        <TouchableOpacity
          onPress={openDrawer}
        >

          <Ionicons
            name="menu-outline"
            size={28}
            color={WHITE}
          />

        </TouchableOpacity>

      </View>


      <View style={styles.placeholderPage}>

        <Text style={styles.placeholderTitle}>

          {screen.charAt(0).toUpperCase() +
            screen.slice(1)}

        </Text>


        <Text style={styles.placeholderText}>
          This screen can be developed next.
        </Text>

      </View>


      <Sidebar />

    </ScreenWrapper>
  );

}


/* =====================================================
   SCREEN WRAPPER
===================================================== */

function ScreenWrapper({ children }) {

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor={NAVY}
      />

      {children}

    </SafeAreaView>
  );

}


/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  placeholder,
  secure,
}) {

  return (
    <View style={styles.inputContainer}>

      <Text style={styles.inputLabel}>
        {label}
      </Text>


      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#777780"
        secureTextEntry={secure}
        style={styles.input}
      />

    </View>
  );

}


/* =====================================================
   EDIT INPUT
===================================================== */

function EditInput({
  label,
  value,
}) {

  return (
    <View style={styles.editInputContainer}>

      <Text style={styles.editLabel}>
        {label}
      </Text>


      <TextInput
        value={value}
        style={styles.editInput}
      />

    </View>
  );

}


/* =====================================================
   GREEN BUTTON
===================================================== */

function GreenButton({
  title,
  onPress,
}) {

  return (
    <TouchableOpacity
      style={styles.greenButton}
      onPress={onPress}
    >

      <Text style={styles.greenButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );

}


/* =====================================================
   DARK BUTTON
===================================================== */

function DarkButton({
  title,
  onPress,
}) {

  return (
    <TouchableOpacity
      style={styles.darkButton}
      onPress={onPress}
    >

      <Text style={styles.darkButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );

}


/* =====================================================
   DRAWER BUTTON
===================================================== */

function DrawerButton({
  icon,
  title,
  onPress,
}) {

  return (
    <TouchableOpacity
      style={styles.drawerButton}
      onPress={onPress}
      activeOpacity={0.75}
    >

      <Ionicons
        name={icon}
        size={20}
        color={NAVY}
      />


      <Text style={styles.drawerButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );

}


/* =====================================================
   SETUP OPTION
===================================================== */

function SetupOption({
  icon,
  title,
  subtitle,
}) {

  return (
    <TouchableOpacity
      style={styles.setupOption}
    >

      <Ionicons
        name={icon}
        size={28}
        color={WHITE}
      />


      <View
        style={{
          marginLeft: 14,
        }}
      >

        <Text style={styles.setupOptionTitle}>
          {title}
        </Text>


        <Text style={styles.setupOptionSubtitle}>
          {subtitle}
        </Text>

      </View>

    </TouchableOpacity>
  );

}


/* =====================================================
   SPENDING CARD
===================================================== */

function SpendingCard() {

  return (
    <View style={styles.spendingCard}>

      <View style={styles.spendingHeader}>

        <Text style={styles.spendingTitle}>
          Spending Breakdown
        </Text>


        <Text style={styles.thisMonth}>
          This Month
        </Text>

      </View>


      <View style={styles.chartRow}>

        <View style={styles.fakeChart}>

          <View style={styles.chartCenter}>

            <Text style={styles.spentLabel}>
              SPENT
            </Text>


            <Text style={styles.spentAmount}>
              $1,240
            </Text>

          </View>

        </View>


        <View style={styles.legend}>

          <Legend
            color="#209B7F"
            text="Shopping"
          />

          <Legend
            color="#3798EF"
            text="Food & Dining"
          />

          <Legend
            color="#FF9900"
            text="Entertainment"
          />

          <Legend
            color="#B34BDB"
            text="Transport"
          />

        </View>

      </View>

    </View>
  );

}


/* =====================================================
   LEGEND
===================================================== */

function Legend({
  color,
  text,
}) {

  return (
    <View style={styles.legendItem}>

      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: color,
          },
        ]}
      />


      <Text style={styles.legendText}>
        {text}
      </Text>

    </View>
  );

}


/* =====================================================
   RECENT UPLOAD
===================================================== */

function RecentUpload() {

  return (
    <View style={styles.recentUpload}>

      <Text style={styles.recentHeaderText}>
        Picture
      </Text>


      <Text style={styles.recentHeaderText}>
        Transaction No.
      </Text>


      <Text style={styles.recentHeaderText}>
        DATE
      </Text>

    </View>
  );

}


/* =====================================================
   RECEIPT ITEM
===================================================== */

function ReceiptItem({
  name,
  price,
}) {

  return (
    <View style={styles.receiptItem}>

      <Text style={styles.receiptItemName}>
        {name}
      </Text>


      <Text style={styles.receiptItemPrice}>
        {price}
      </Text>

    </View>
  );

}


/* =====================================================
   REVIEW ROW
===================================================== */

function ReviewRow({
  icon,
  label,
  value,
  dropdown,
}) {

  return (
    <View style={styles.reviewRow}>

      <Ionicons
        name={icon}
        size={17}
        color="#707780"
      />


      <Text style={styles.reviewLabel}>
        {label}
      </Text>


      <View
        style={{
          flex: 1,
        }}
      />


      <Text style={styles.reviewValue}>
        {value}
      </Text>


      {dropdown && (
        <Ionicons
          name="chevron-down"
          size={16}
          color={NAVY}
        />
      )}

    </View>
  );

}


/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({

  /* ================================================
     GENERAL
  ================================================ */

  container: {
    flex: 1,
    backgroundColor: BG,
  },


  /* ================================================
     LOGIN / REGISTER
  ================================================ */

  authTop: {
    height: "41%",
    backgroundColor: NAVY,
    paddingHorizontal: 25,
    paddingTop: 20,
  },


  fakeLogo: {
    width: 34,
    height: 34,
    backgroundColor: "#242432",
    borderRadius: 7,
    marginBottom: 20,
  },


  menuIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },


  authHeading: {
    color: WHITE,
    fontSize: 20,
    lineHeight: 25,
    marginTop: 25,
    fontWeight: "400",
  },


  authBottom: {
    backgroundColor: DARK,
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 15,
  },


  authTitle: {
    color: WHITE,
    fontSize: 21,
    textAlign: "center",
    fontWeight: "800",
    fontFamily: "serif",
    marginBottom: 10,
  },


  authSubtitle: {
    color: "#777780",
    textAlign: "center",
    fontSize: 11,
    marginBottom: 22,
  },


  inputContainer: {
    marginBottom: 17,
  },


  inputLabel: {
    color: WHITE,
    fontSize: 11,
    marginBottom: 6,
  },


  input: {
    height: 32,
    color: WHITE,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAB0",
    paddingHorizontal: 0,
  },


  greenButton: {
    width: "100%",
    height: 42,
    backgroundColor: GREEN,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },


  greenButtonText: {
    color: "#101015",
    fontSize: 14,
    fontWeight: "500",
  },


  accountLink: {
    marginTop: 15,
    alignItems: "center",
  },


  accountText: {
    color: WHITE,
    fontSize: 11,
  },


  /* ================================================
     SETUP
  ================================================ */

  setupTop: {
    height: "41%",
    backgroundColor: NAVY,
    padding: 25,
    justifyContent: "flex-start",
  },


  setupHeading: {
    color: WHITE,
    fontSize: 21,
    lineHeight: 27,
  },


  setupBottom: {
    flex: 1,
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 15,
  },


  setupDescription: {
    color: "#777780",
    textAlign: "center",
    fontSize: 11,
    marginBottom: 25,
  },


  setupOption: {
    backgroundColor: NAVY,
    minHeight: 48,
    borderRadius: 7,
    marginBottom: 18,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },


  setupOptionTitle: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
  },


  setupOptionSubtitle: {
    color: WHITE,
    fontSize: 10,
  },


  /* ================================================
     DASHBOARD
  ================================================ */

  dashboardHeader: {
    backgroundColor: NAVY,
    height: 188,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 20,
  },


  dashboardMenu: {
    position: "absolute",
    left: 20,
    top: 30,
  },


  welcomeSmall: {
    position: "absolute",
    left: 70,
    top: 30,
    color: "#AAAAC5",
    fontSize: 11,
  },


  dashboardUser: {
    position: "absolute",
    left: 70,
    top: 52,
    color: WHITE,
    fontSize: 18,
    fontWeight: "700",
  },


  avatar: {
    position: "absolute",
    right: 22,
    top: 38,
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },


  balanceLabel: {
    position: "absolute",
    left: 20,
    top: 83,
    color: "#AAAAC5",
    fontSize: 9,
  },


  balance: {
    position: "absolute",
    left: 20,
    top: 100,
    color: WHITE,
    fontSize: 30,
    fontWeight: "800",
  },


  balanceDecimal: {
    color: "#AAAAC5",
    fontSize: 16,
  },


  scanButton: {
    alignItems: "center",
    marginTop: 8,
  },


  scanCircle: {
    width: 52,
    height: 52,
    backgroundColor: NAVY,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },


  scanText: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },


  /* ================================================
     SPENDING
  ================================================ */

  spendingCard: {
    backgroundColor: WHITE,
    marginHorizontal: 15,
    marginTop: 22,
    borderRadius: 16,
    padding: 17,
    elevation: 4,
  },


  spendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },


  spendingTitle: {
    fontSize: 15,
    fontWeight: "800",
  },


  thisMonth: {
    fontSize: 11,
    fontWeight: "700",
  },


  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },


  fakeChart: {
    width: 105,
    height: 105,
    borderRadius: 60,
    borderWidth: 13,
    borderColor: "#209B7F",
    borderRightColor: "#3798EF",
    borderBottomColor: "#FF9900",
    borderLeftColor: "#B34BDB",
    justifyContent: "center",
    alignItems: "center",
  },


  chartCenter: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },


  spentLabel: {
    color: "#888",
    fontSize: 8,
  },


  spentAmount: {
    fontWeight: "800",
    fontSize: 14,
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
    marginRight: 8,
  },


  legendText: {
    fontSize: 11,
  },


  /* ================================================
     SCAN
  ================================================ */

  simpleHeader: {
    height: 80,
    backgroundColor: NAVY,
    paddingHorizontal: 18,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },


  scanHome: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 50,
  },


  darkButton: {
    width: "100%",
    height: 50,
    backgroundColor: NAVY,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },


  darkButtonText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
  },


  recentTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
    marginBottom: 17,
  },


  recentUpload: {
    height: 40,
    backgroundColor: NAVY,
    borderRadius: 17,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },


  recentHeaderText: {
    color: WHITE,
    fontSize: 7,
    fontWeight: "700",
  },


  /* ================================================
     CAMERA
  ================================================ */

  cameraScreen: {
    flex: 1,
    backgroundColor: NAVY,
  },


  cameraHeader: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },


  cameraTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
  },


  cameraFrame: {
    height: width * 0.75,
    marginHorizontal: 20,
    borderWidth: 3,
    borderColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },


  receiptPreview: {
    width: "85%",
    height: "88%",
    backgroundColor: "#F2F3F7",
    padding: 15,
  },


  receiptStore: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900",
    color: "#272727",
  },


  receiptSmall: {
    textAlign: "center",
    fontSize: 7,
    color: "#777",
  },


  receiptCenter: {
    textAlign: "center",
    fontSize: 8,
    fontWeight: "800",
    marginBottom: 12,
    color: "#333",
  },


  receiptLine: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderBottomColor: "#DDD",
    marginVertical: 8,
  },


  receiptItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },


  receiptItemName: {
    fontSize: 7,
    color: "#444",
  },


  receiptItemPrice: {
    fontSize: 7,
    color: "#444",
  },


  receiptTotal: {
    fontSize: 9,
    fontWeight: "900",
    color: "#333",
  },


  thankYou: {
    textAlign: "center",
    fontSize: 8,
    fontWeight: "700",
    marginTop: 20,
  },


  alignText: {
    color: WHITE,
    textAlign: "center",
    marginTop: 28,
    fontSize: 12,
  },


  cameraActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    marginTop: 15,
  },


  cameraActionButton: {
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 10,
    height: 40,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },


  cameraActionText: {
    color: WHITE,
    fontWeight: "700",
    marginLeft: 6,
  },


  deleteScan: {
    backgroundColor: "#FFE7E8",
    borderRadius: 10,
    height: 40,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },


  deleteText: {
    color: RED,
    fontWeight: "700",
    marginLeft: 5,
  },


  cameraBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
  },


  roundIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#171742",
    justifyContent: "center",
    alignItems: "center",
  },


  shutter: {
    width: 68,
    height: 68,
    borderRadius: 40,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },


  shutterInner: {
    width: 59,
    height: 59,
    borderRadius: 35,
    backgroundColor: NAVY,
    borderWidth: 3,
    borderColor: WHITE,
  },


  /* ================================================
     REVIEW
  ================================================ */

  reviewHeader: {
    height: 108,
    backgroundColor: NAVY,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },


  reviewTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },


  reviewSubtitle: {
    position: "absolute",
    left: 18,
    bottom: 14,
    color: "#AAAAC5",
    fontSize: 10,
  },


  reviewBody: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 17,
  },


  extractedCard: {
    backgroundColor: "#E6FAFA",
    borderWidth: 1,
    borderColor: "#20BDB4",
    borderRadius: 11,
    minHeight: 125,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },


  storeName: {
    color: "#777",
    marginTop: 4,
    fontSize: 10,
  },


  extractedAmount: {
    fontSize: 27,
    fontWeight: "900",
    color: "#222",
  },


  extractedText: {
    color: "#777",
    fontSize: 8,
    textAlign: "center",
    marginTop: 4,
  },


  reviewRow: {
    minHeight: 39,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },


  reviewLabel: {
    color: "#737981",
    fontSize: 11,
    marginLeft: 10,
  },


  reviewValue: {
    color: "#252525",
    fontSize: 11,
    fontWeight: "700",
    marginRight: 8,
  },


  editDeleteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },


  editButton: {
    width: "48%",
    height: 40,
    borderWidth: 1,
    borderColor: NAVY,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },


  editText: {
    color: NAVY,
    fontWeight: "700",
    marginLeft: 5,
  },


  deleteButton: {
    width: "48%",
    height: 40,
    borderWidth: 1,
    borderColor: RED,
    backgroundColor: "#FFE7E8",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },


  /* ================================================
     EDIT
  ================================================ */

  editHeaderTitle: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 20,
  },


  editInputContainer: {
    marginBottom: 20,
  },


  editLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 6,
  },


  editInput: {
    height: 45,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#222",
    backgroundColor: WHITE,
  },


  /* ================================================
     ANIMATED SIDEBAR
  ================================================ */

  drawerOverlay: {
    position: "absolute",

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    zIndex: 1000,
  },


  /*
   * Dark background behind sidebar
   */

  drawerBackdrop: {
    position: "absolute",

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: "#000000",
  },


  /*
   * Actual sidebar
   */

  drawer: {
    position: "absolute",

    left: 0,
    top: 0,
    bottom: 0,

    width: width * 0.47,

    backgroundColor: NAVY,

    paddingHorizontal: 15,
    paddingTop: 30,

    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,

    elevation: 15,

    shadowColor: "#000",

    shadowOffset: {
      width: 4,
      height: 0,
    },

    shadowOpacity: 0.3,

    shadowRadius: 8,
  },


  drawerTop: {
    height: 60,

    justifyContent: "center",
  },


  closeButton: {
    width: 38,
    height: 38,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 20,
  },


  drawerButton: {
    backgroundColor: "#F0F0F0",

    height: 43,

    borderRadius: 22,

    marginBottom: 10,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    elevation: 2,
  },


  drawerButtonText: {
    color: NAVY,

    fontSize: 10,

    fontWeight: "700",

    marginLeft: 8,
  },


  /* ================================================
     PLACEHOLDER
  ================================================ */

  placeholderPage: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },


  placeholderTitle: {
    fontSize: 26,

    fontWeight: "800",

    color: NAVY,
  },


  placeholderText: {
    color: GRAY,

    marginTop: 10,
  },

});