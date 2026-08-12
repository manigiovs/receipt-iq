import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  black: "#09090B",
  navy: "#101117",
  card: "#181920",
  green: "#19B394",
  greenDark: "#118D78",
  white: "#FFFFFF",
  gray: "#92939A",
  lightGray: "#C8C8CC",
  border: "#303139",
  red: "#FF4545",
  blue: "#5D7EFF",
  yellow: "#E9B94B",
};
const logout = () => {
  setUser(null);
  setMenuVisible(false);
  setScreen("signin");
};

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Uniqlo",
      category: "Shopping",
      amount: 534.4,
      date: "Today",
    },
    {
      id: 2,
      name: "Jollibee",
      category: "Food & Dining",
      amount: 520,
      date: "Today",
    },
    {
      id: 3,
      name: "Netflix",
      category: "Entertainment",
      amount: 459,
      date: "Yesterday",
    },
  ]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = (page) => {
    setMenuVisible(false);
    setScreen(page);
  };

  /* =======================================================
     ADD EXPENSE
  ======================================================= */

  const addExpense = (expense) => {
    setExpenses((previous) => [
      {
        ...expense,
        id: Date.now(),
        date: "Today",
      },
      ...previous,
    ]);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    setUser(null);
    setMenuVisible(false);

    // Go to SIGN IN after logout
    setScreen("signin");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
      />

      <View style={styles.container}>

        {/* LANDING */}

        {screen === "landing" && (
          <LandingScreen
            onMenu={() => setMenuVisible(true)}
            onCreate={() => navigate("create")}
            onSignIn={() => navigate("signin")}
            onHow={() => navigate("how")}
          />
        )}

        {/* HOW IT WORKS */}

        {screen === "how" && (
          <HowItWorksScreen
            onMenu={() => setMenuVisible(true)}
            onCreate={() => navigate("create")}
            onSignIn={() => navigate("signin")}
          />
        )}

        {/* CREATE ACCOUNT */}

        {screen === "create" && (
          <CreateAccountScreen
            onBack={() => navigate("landing")}
            onSignIn={() => navigate("signin")}
            onCreate={(newUser) => {
              setUser(newUser);
              navigate("dashboard");
            }}
          />
        )}

        {/* SIGN IN */}

        {screen === "signin" && (
          <SignInScreen
            onBack={() => navigate("landing")}
            onCreate={() => navigate("create")}
            onLogin={(loggedUser) => {
              setUser(loggedUser);
              navigate("dashboard");
            }}
          />
        )}

        {/* DASHBOARD */}

        {screen === "dashboard" && (
          <DashboardScreen
            user={user}
            expenses={expenses}
            onNavigate={navigate}
            onAddExpense={addExpense}
          />
        )}

        {/* RECORDS */}

        {screen === "records" && (
          <RecordsScreen
            expenses={expenses}
            onNavigate={navigate}
            onAddExpense={addExpense}
          />
        )}

        {/* PROFILE */}

        {screen === "profile" && (
          <ProfileScreen
            user={user}
            onNavigate={navigate}
            onLogout={logout}
          />
        )}

        {/* MENU */}

        <MobileMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onNavigate={navigate}
        />

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  onMenu,
  showBack = false,
  onBack,
}) {
  return (
    <View style={styles.header}>

      {showBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerIcon}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 35 }} />
      )}

      <Text style={styles.logo}>
        RECEIPT
        <Text style={styles.logoGreen}>
          IQ
        </Text>
      </Text>

      {onMenu ? (
        <TouchableOpacity
          onPress={onMenu}
          style={styles.headerIcon}
        >
          <Ionicons
            name="menu"
            size={30}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 35 }} />
      )}

    </View>
  );
}

/* =========================================================
   TAG
========================================================= */

function Tag({ text }) {
  return (
    <View style={styles.tag}>

      <View style={styles.diamond} />

      <Text style={styles.tagText}>
        {text}
      </Text>

    </View>
  );
}

/* =========================================================
   LANDING SCREEN
========================================================= */

function LandingScreen({
  onMenu,
  onCreate,
  onSignIn,
  onHow,
}) {
  return (
    <View style={styles.page}>

      <Header onMenu={onMenu} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.landingContent}
      >

        <Tag text="EXPENSE MANAGEMENT, ITEMIZED" />

        <Text style={styles.heroTitle}>
          Every Receipt.
          {"\n"}
          Accounted For.
        </Text>

        <Text style={styles.heroDescription}>
          ReceiptIQ scans, categorizes, and
          {"\n"}
          reconciles every expense the moment it
          {"\n"}
          lands in your inbox.
        </Text>

        <PrimaryButton
          title="Get Started Free"
          onPress={onCreate}
        />

        <SecondaryButton
          title="See how it works"
          onPress={onHow}
        />

        <TouchableOpacity
          style={styles.signInBottom}
          onPress={onSignIn}
        >
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.greenText}>
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>

        <ReceiptPreview />

      </ScrollView>

    </View>
  );
}

/* =========================================================
   RECEIPT PREVIEW
========================================================= */

function ReceiptPreview() {
  return (
    <View style={styles.receiptWrapper}>

      <View style={styles.receipt}>

        <Text style={styles.receiptTitle}>
          RECEIPTIQ
        </Text>

        <View style={styles.receiptLine} />

        <Text style={styles.receiptNumber}>
          RECEIPT # 0004251
        </Text>

        <View style={styles.receiptLine} />

        <ReceiptRow
          text="2 Transportation"
          amount="₱ 100"
        />

        <ReceiptRow
          text="1 Meals"
          amount="₱ 100"
        />

        <ReceiptRow
          text="2 School Supplies"
          amount="₱ 500"
        />

        <ReceiptRow
          text="5 Communication"
          amount="₱ 500"
        />

        <View style={styles.receiptLine} />

        <ReceiptRow
          text="Subtotal"
          amount="₱ 1200"
        />

        <ReceiptRow
          text="Tax"
          amount="₱ 25"
        />

        <View style={{ height: 15 }} />

        <ReceiptRow
          text="Total"
          amount="₱ 1225"
        />

        <ReceiptRow
          text="Cash"
          amount="₱ 1500"
        />

        <ReceiptRow
          text="Change"
          amount="₱ 275"
        />

        <Text style={styles.receiptDate}>
          8/8/2026 10:28:54 AM
        </Text>

      </View>

    </View>
  );
}

function ReceiptRow({
  text,
  amount,
}) {
  return (
    <View style={styles.receiptRow}>

      <Text style={styles.receiptText}>
        {text}
      </Text>

      <Text style={styles.receiptText}>
        {amount}
      </Text>

    </View>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorksScreen({
  onMenu,
  onCreate,
  onSignIn,
}) {
  const steps = [
    {
      number: "01",
      icon: "person-outline",
      title: "Create Your Account",
      description:
        "Register and log in securely to get your own private space for every expense record.",
    },
    {
      number: "02",
      icon: "camera-outline",
      title: "Add or Scan a Receipt",
      description:
        "Take a photo of a receipt or add an expense manually.",
    },
    {
      number: "03",
      icon: "pricetag-outline",
      title: "Sorted and Tracked",
      description:
        "Each expense is organized into categories such as Food, Transport and Shopping.",
    },
    {
      number: "04",
      icon: "search-outline",
      title: "Review and Search",
      description:
        "Search your records and review your spending whenever you need them.",
    },
  ];

  return (
    <View style={styles.page}>

      <Header onMenu={onMenu} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.howContent}
      >

        <Tag text="HOW IT WORKS" />

        <Text style={styles.howTitle}>
          From sign-up to
          {"\n"}
          spending clarity,
          {"\n"}
          in four steps.
        </Text>

        <Text style={styles.heroDescription}>
          Every feature works together
          {"\n"}
          from your first login to your
          {"\n"}
          monthly report.
        </Text>

        {steps.map((step) => (
          <View
            style={styles.stepCard}
            key={step.number}
          >

            <View style={styles.stepIcon}>

              <Ionicons
                name={step.icon}
                size={27}
                color={COLORS.green}
              />

            </View>

            <View style={styles.stepContent}>

              <Text style={styles.stepNumber}>
                STEP {step.number}
              </Text>

              <Text style={styles.stepTitle}>
                {step.title}
              </Text>

              <Text style={styles.stepDescription}>
                {step.description}
              </Text>

            </View>

          </View>
        ))}

        <PrimaryButton
          title="Get Started Free"
          onPress={onCreate}
        />

        <TouchableOpacity
          style={styles.signInBottom}
          onPress={onSignIn}
        >

          <Text style={styles.signInText}>
            Sign In
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

/* =========================================================
   CREATE ACCOUNT
========================================================= */

function CreateAccountScreen({
  onBack,
  onSignIn,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = () => {

    if (!name.trim()) {
      Alert.alert(
        "Missing Name",
        "Please enter your name."
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        "Missing Email",
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Missing Password",
        "Please enter a password."
      );
      return;
    }

    onCreate({
      name: name.trim(),
      email: email.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >

        <View style={styles.authTop}>

          <Header
            showBack
            onBack={onBack}
          />

          <View style={styles.authHero}>

            <Text style={styles.authHeroTitle}>
              Join Us.
              {"\n"}
              Start Something New.
            </Text>

            <Tag text="EXPENSE MANAGEMENT, ITEMIZED" />

          </View>

        </View>

        <View style={styles.authPanel}>

          <Text style={styles.authTitle}>
            CREATE ACCOUNT
          </Text>

          <Text style={styles.authSubtitle}>
            Take less than a minute.
          </Text>

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Create Account"
            onPress={createAccount}
          />

          <View style={styles.authFooter}>

            <Text style={styles.footerText}>
              Already have an Account?{" "}
            </Text>

            <TouchableOpacity onPress={onSignIn}>
              <Text style={styles.greenText}>
                Sign In
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

/* =========================================================
   SIGN IN
========================================================= */

function SignInScreen({
  onBack,
  onCreate,
  onLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    if (!email.trim()) {
      Alert.alert(
        "Missing Email",
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Missing Password",
        "Please enter your password."
      );
      return;
    }

    onLogin({
      name:
        email.split("@")[0] || "User",
      email: email.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >

        <View style={styles.authTop}>

          <Header
            showBack
            onBack={onBack}
          />

          <View style={styles.signinHero}>

            <Text style={styles.authHeroTitle}>
              Welcome Back.
              {"\n"}
              Good to See You Again.
            </Text>

            <Tag text="EXPENSE MANAGEMENT, ITEMIZED" />

          </View>

        </View>

        <View style={styles.authPanel}>

          <Text style={styles.authTitle}>
            SIGN IN
          </Text>

          <Text style={styles.authSubtitle}>
            Enter your details to continue.
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Sign In"
            onPress={login}
          />

          <View style={styles.authFooter}>

            <Text style={styles.footerText}>
              New here?{" "}
            </Text>

            <TouchableOpacity onPress={onCreate}>
              <Text style={styles.greenText}>
                Create an Account
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}) {
  return (
    <View style={styles.inputContainer}>

      <Text style={styles.inputLabel}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#55565D"
      />

    </View>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardScreen({
  user,
  expenses,
  onNavigate,
  onAddExpense,
}) {
  const [modalVisible, setModalVisible] =
    useState(false);

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  return (
    <View style={styles.dashboardPage}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >

        <View style={styles.dashboardHeader}>

          <View>

            <Text style={styles.welcomeSmall}>
              Welcome Back,
            </Text>

            <Text style={styles.dashboardUser}>
              {user?.name || "User"}
            </Text>

          </View>
        </View>

        <View style={styles.balanceCard}>

          <Text style={styles.balanceLabel}>
            TOTAL EXPENSES
          </Text>

          <Text style={styles.balanceAmount}>
            ₱
            {total.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </Text>

          <Text style={styles.balanceHint}>
            Your expenses are being tracked
          </Text>

        </View>

        <View style={styles.quickActions}>

          <QuickAction
            icon="camera-outline"
            title="Scan"
            onPress={() =>
              setModalVisible(true)
            }
          />

          <QuickAction
            icon="add-circle-outline"
            title="Add"
            onPress={() =>
              setModalVisible(true)
            }
          />

          <QuickAction
            icon="wallet-outline"
            title="Budget"
            onPress={() =>
              Alert.alert(
                "Budget",
                "Budget management will be available here."
              )
            }
          />

        </View>

        <SectionTitle
          title="Spending by Category"
          action="This Month"
        />

        <SpendingChart
          expenses={expenses}
        />

        <View style={styles.recentHeader}>

          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          <TouchableOpacity
            onPress={() =>
              onNavigate("records")
            }
          >

            <Text style={styles.viewAll}>
              View All →
            </Text>

          </TouchableOpacity>

        </View>

        <View style={styles.recentContainer}>

          {expenses
            .slice(0, 3)
            .map((expense) => (
              <TransactionRow
                key={expense.id}
                expense={expense}
              />
            ))}

        </View>

      </ScrollView>

      <BottomNavigation
        active="dashboard"
        onNavigate={onNavigate}
      />

      <AddExpenseModal
        visible={modalVisible}
        onClose={() =>
          setModalVisible(false)
        }
        onAdd={(expense) => {
          onAddExpense(expense);
          setModalVisible(false);
        }}
      />

    </View>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Ionicons
        name={icon}
        size={23}
        color={COLORS.green}
      />

      <Text style={styles.quickActionText}>
        {title}
      </Text>

    </TouchableOpacity>
  );
}

/* =========================================================
   SPENDING CHART
========================================================= */

function SpendingChart({
  expenses,
}) {
  const categories = [
    {
      name: "Shopping",
      color: COLORS.green,
    },
    {
      name: "Food & Dining",
      color: COLORS.blue,
    },
    {
      name: "Entertainment",
      color: COLORS.yellow,
    },
    {
      name: "Transportation",
      color: COLORS.red,
    },
  ];

  const getTotal = (category) =>
    expenses
      .filter(
        (item) =>
          item.category === category
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      );

  const max = Math.max(
    ...categories.map((x) =>
      getTotal(x.name)
    ),
    100
  );

  return (
    <View style={styles.chartCard}>

      <View style={styles.chartHeader}>

        <Text style={styles.chartTitle}>
          Spending by Category
        </Text>

        <Text style={styles.chartMonth}>
          This Month
        </Text>

      </View>

      {categories.map((category) => {

        const amount =
          getTotal(category.name);

        return (
          <View
            key={category.name}
            style={styles.chartRow}
          >

            <View style={styles.chartLabelRow}>

              <Text style={styles.chartCategory}>
                {category.name}
              </Text>

              <Text style={styles.chartAmount}>
                ₱{amount.toFixed(2)}
              </Text>

            </View>

            <View style={styles.progressBackground}>

              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.max(
                      (amount / max) * 100,
                      3
                    )}%`,
                    backgroundColor:
                      category.color,
                  },
                ]}
              />

            </View>

          </View>
        );
      })}

    </View>
  );
}

/* =========================================================
   RECORDS
========================================================= */

function RecordsScreen({
  expenses,
  onNavigate,
  onAddExpense,
}) {
  const [search, setSearch] =
    useState("");

  const [modalVisible, setModalVisible] =
    useState(false);

  const filtered =
    expenses.filter((expense) =>
      `${expense.name} ${expense.category}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <View style={styles.dashboardPage}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >

        <Text style={styles.recordsTitle}>
          Records
        </Text>

        <View style={styles.searchBox}>

          <Ionicons
            name="search-outline"
            size={19}
            color={COLORS.gray}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search Records"
            placeholderTextColor="#66676E"
            value={search}
            onChangeText={setSearch}
          />

        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >

          {[
            "All",
            "Shopping",
            "Food & Dining",
            "Entertainment",
            "Transportation",
          ].map((filter, index) => (

            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                index === 0 &&
                  styles.filterButtonActive,
              ]}
            >

              <Text
                style={[
                  styles.filterText,
                  index === 0 &&
                    styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>

            </TouchableOpacity>

          ))}

        </ScrollView>

        <Text style={styles.dateHeading}>
          RECENT
        </Text>

        {filtered.map((expense) => (
          <View
            key={expense.id}
            style={{
              marginHorizontal: 20,
            }}
          >

            <TransactionRow
              expense={expense}
            />

          </View>
        ))}

        {filtered.length === 0 && (
          <Text style={styles.emptyText}>
            No records found.
          </Text>
        )}

      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          setModalVisible(true)
        }
      >

        <Ionicons
          name="add"
          size={28}
          color={COLORS.black}
        />

      </TouchableOpacity>

      <BottomNavigation
        active="records"
        onNavigate={onNavigate}
      />

      <AddExpenseModal
        visible={modalVisible}
        onClose={() =>
          setModalVisible(false)
        }
        onAdd={(expense) => {
          onAddExpense(expense);
          setModalVisible(false);
        }}
      />

    </View>
  );
}

/* =========================================================
   TRANSACTION
========================================================= */

function TransactionRow({
  expense,
}) {
  const iconMap = {
    Shopping: "cart-outline",
    "Food & Dining":
      "restaurant-outline",
    Entertainment:
      "game-controller-outline",
    Transportation:
      "car-outline",
  };

  return (
    <View style={styles.transaction}>

      <View style={styles.transactionIcon}>

        <Ionicons
          name={
            iconMap[expense.category] ||
            "receipt-outline"
          }
          size={21}
          color={COLORS.green}
        />

      </View>

      <View style={styles.transactionInfo}>

        <Text style={styles.transactionName}>
          {expense.name}
        </Text>

        <Text style={styles.transactionCategory}>
          {expense.category}
        </Text>

      </View>

      <Text style={styles.transactionAmount}>
        ₱
        {Number(expense.amount).toFixed(2)}
      </Text>

    </View>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileScreen({
  user,
  onNavigate,
  onLogout,
}) {
  const handleLogout = () => {

    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",

          onPress: () => {
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.dashboardPage}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        <Text style={styles.profileTitle}>
          Profile
        </Text>

        <View style={styles.profileAvatar}>

          <Ionicons
            name="person-outline"
            size={50}
            color={COLORS.green}
          />

        </View>

        <Text style={styles.profileName}>
          {user?.name || "User"}
        </Text>

        <Text style={styles.profileEmail}>
          {user?.email ||
            "username@email.com"}
        </Text>

        <View style={styles.statsRow}>

          <Stat
            label="RECEIPTS"
            value="142"
          />

          <Stat
            label="TOTAL SPENT"
            value="₱22,340"
          />

          <Stat
            label="DAYS ACTIVE"
            value="18"
          />

        </View>

        <Text style={styles.profileSection}>
          ACCOUNT
        </Text>

        <View style={styles.profileMenu}>

          <ProfileOption
            icon="create-outline"
            title="Edit Profile"
          />

          <ProfileOption
            icon="options-outline"
            title="Preferences"
          />

          <ProfileOption
            icon="shield-checkmark-outline"
            title="Security"
          />

        </View>

        <Text style={styles.profileSection}>
          SUPPORT
        </Text>

        <View style={styles.profileMenu}>

          <ProfileOption
            icon="help-circle-outline"
            title="Help & Support"
          />

        </View>

        {/* FIXED LOGOUT BUTTON */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out-outline"
            size={20}
            color={COLORS.red}
          />

          <Text style={styles.logoutText}>
            Log Out
          </Text>

        </TouchableOpacity>

      </ScrollView>

      <BottomNavigation
        active="profile"
        onNavigate={onNavigate}
      />

    </View>
  );
}

/* =========================================================
   PROFILE STAT
========================================================= */

function Stat({
  label,
  value,
}) {
  return (
    <View style={styles.statBox}>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>

    </View>
  );
}

/* =========================================================
   PROFILE OPTION
========================================================= */

function ProfileOption({
  icon,
  title,
}) {
  return (
    <TouchableOpacity
      style={styles.profileOption}
      onPress={() =>
        Alert.alert(
          title,
          `${title} settings will be available here.`
        )
      }
    >

      <View style={styles.profileOptionLeft}>

        <Ionicons
          name={icon}
          size={20}
          color={COLORS.lightGray}
        />

        <Text style={styles.profileOptionText}>
          {title}
        </Text>

      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={COLORS.gray}
      />

    </TouchableOpacity>
  );
}

/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

function BottomNavigation({
  active,
  onNavigate,
}) {
  return (
    <View style={styles.bottomNav}>

      <NavItem
        icon="home-outline"
        activeIcon="home"
        active={
          active === "dashboard"
        }
        onPress={() =>
          onNavigate("dashboard")
        }
      />

      <NavItem
        icon="list-outline"
        activeIcon="list"
        active={
          active === "records"
        }
        onPress={() =>
          onNavigate("records")
        }
      />

      <NavItem
        icon="person-outline"
        activeIcon="person"
        active={
          active === "profile"
        }
        onPress={() =>
          onNavigate("profile")
        }
      />

    </View>
  );
}

function NavItem({
  icon,
  activeIcon,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
    >

      <Ionicons
        name={
          active
            ? activeIcon
            : icon
        }
        size={24}
        color={
          active
            ? COLORS.green
            : COLORS.gray
        }
      />

    </TouchableOpacity>
  );
}

/* =========================================================
   MOBILE MENU
========================================================= */

function MobileMenu({
  visible,
  onClose,
  onNavigate,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >

      <SafeAreaView
        style={styles.menuScreen}
      >

        <View style={styles.menuHeader}>

          <Text style={styles.logo}>
            RECEIPT
            <Text style={styles.logoGreen}>
              IQ
            </Text>
          </Text>

          <TouchableOpacity
            onPress={onClose}
          >

            <Ionicons
              name="close"
              size={34}
              color={COLORS.white}
            />

          </TouchableOpacity>

        </View>

        <View style={styles.menuDivider} />

        <MenuItem
          title="Features"
          onPress={() =>
            Alert.alert(
              "Features",
              "Receipt scanning, expense categorization, reports, search and spending analysis."
            )
          }
        />

        <MenuItem
          title="Pricing"
          onPress={() =>
            Alert.alert(
              "Pricing",
              "ReceiptIQ is currently free during development."
            )
          }
        />

        <MenuItem
          title="Customers"
          onPress={() =>
            Alert.alert(
              "Customers",
              "Built for students, employees, families and small businesses."
            )
          }
        />

        <MenuItem
          title="About"
          onPress={() =>
            Alert.alert(
              "About ReceiptIQ",
              "ReceiptIQ helps users capture, organize and understand their expenses."
            )
          }
        />

        <View style={styles.menuBottom}>

          <Tag text="EXPENSE MANAGEMENT, ITEMIZED" />

          <PrimaryButton
            title="Get Started Free"
            onPress={() =>
              onNavigate("create")
            }
          />

          <TouchableOpacity
            style={styles.signInBottom}
            onPress={() =>
              onNavigate("signin")
            }
          >

            <Text style={styles.signInText}>
              Sign In
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    </Modal>
  );
}

function MenuItem({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >

      <Text style={styles.menuItemText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={23}
        color={COLORS.lightGray}
      />

    </TouchableOpacity>
  );
}

/* =========================================================
   ADD EXPENSE MODAL
========================================================= */

function AddExpenseModal({
  visible,
  onClose,
  onAdd,
}) {
  const [store, setStore] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Shopping");

  const [receiptImage, setReceiptImage] =
    useState(null);

  /* =======================================================
     TAKE PHOTO
  ======================================================= */

  const takePhoto = async () => {

    try {

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          "Camera Permission",
          "Please allow camera access in your iPhone Settings."
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled) {

        setReceiptImage(
          result.assets[0].uri
        );

      }

    } catch (error) {

      console.log(
        "Camera error:",
        error
      );

      Alert.alert(
        "Camera Error",
        "Unable to open the camera."
      );
    }
  };

  /* =======================================================
     PHOTO LIBRARY
  ======================================================= */

  const chooseFromLibrary =
    async () => {

      try {

        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {

          Alert.alert(
            "Photo Permission",
            "Please allow photo access in your iPhone Settings."
          );

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
              ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

        if (!result.canceled) {

          setReceiptImage(
            result.assets[0].uri
          );

        }

      } catch (error) {

        console.log(
          "Photo library error:",
          error
        );

        Alert.alert(
          "Photo Error",
          "Unable to open your photo library."
        );
      }
    };

  /* =======================================================
     PHOTO OPTIONS
  ======================================================= */

  const showPhotoOptions =
    () => {

      Alert.alert(
        "Receipt Photo",
        "Choose an option",
        [
          {
            text: "Take Photo",
            onPress: takePhoto,
          },
          {
            text: "Choose from Photos",
            onPress:
              chooseFromLibrary,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    };

  /* =======================================================
     SAVE EXPENSE
  ======================================================= */

  const submit = () => {

    if (!store.trim()) {

      Alert.alert(
        "Missing Information",
        "Enter the store or description."
      );

      return;
    }

    if (!amount.trim()) {

      Alert.alert(
        "Missing Amount",
        "Enter the expense amount."
      );

      return;
    }

    const numericAmount =
      Number(
        amount.replace(/,/g, "")
      );

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {

      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount."
      );

      return;
    }

    onAdd({
      name: store.trim(),
      amount: numericAmount,
      category,
      image: receiptImage,
    });

    setStore("");
    setAmount("");
    setCategory("Shopping");
    setReceiptImage(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >

      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <View style={styles.modalCard}>

          <View style={styles.modalHeader}>

            <Text style={styles.modalTitle}>
              Add Expense
            </Text>

            <TouchableOpacity
              onPress={onClose}
            >

              <Ionicons
                name="close"
                size={27}
                color={COLORS.white}
              />

            </TouchableOpacity>

          </View>

          {/* RECEIPT IMAGE */}

          {receiptImage && (
            <View
              style={
                styles.receiptImageContainer
              }
            >

              <Image
                source={{
                  uri: receiptImage,
                }}
                style={styles.receiptImage}
              />

              <TouchableOpacity
                style={styles.removePhoto}
                onPress={() =>
                  setReceiptImage(null)
                }
              >

                <Ionicons
                  name="close"
                  size={17}
                  color={COLORS.white}
                />

              </TouchableOpacity>

            </View>
          )}

          <Text style={styles.modalLabel}>
            Store / Description
          </Text>

          <TextInput
            style={styles.modalInput}
            value={store}
            onChangeText={setStore}
            placeholder="e.g. Jollibee"
            placeholderTextColor="#66676E"
          />

          <Text style={styles.modalLabel}>
            Amount
          </Text>

          <TextInput
            style={styles.modalInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 250"
            placeholderTextColor="#66676E"
            keyboardType="decimal-pad"
          />

          <Text style={styles.modalLabel}>
            Category
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: 18,
            }}
          >

            {[
              "Shopping",
              "Food & Dining",
              "Entertainment",
              "Transportation",
            ].map((item) => (

              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item &&
                    styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setCategory(item)
                }
              >

                <Text
                  style={[
                    styles.categoryButtonText,
                    category === item &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {item}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

          {/* CAMERA BUTTON */}

          <TouchableOpacity
            style={styles.scanPhotoButton}
            onPress={showPhotoOptions}
          >

            <Ionicons
              name="camera-outline"
              size={20}
              color={COLORS.green}
            />

            <Text style={styles.scanPhotoText}>
              {receiptImage
                ? "Change Receipt Photo"
                : "Scan / Take Photo"}
            </Text>

          </TouchableOpacity>

          <PrimaryButton
            title="Save Expense"
            onPress={submit}
          />

        </View>

      </KeyboardAvoidingView>

    </Modal>
  );
}

/* =========================================================
   BUTTONS
========================================================= */

function PrimaryButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Text style={styles.primaryButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );
}

function SecondaryButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Text style={styles.secondaryButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );
}

function SectionTitle({
  title,
  action,
}) {
  return (
    <View style={styles.sectionHeader}>

      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.sectionAction}>
        {action}
      </Text>

    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  page: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  /* HEADER */

  header: {
    height: 72,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: 1,
    fontWeight: "500",
  },

  logoGreen: {
    color: COLORS.green,
  },

  /* TAG */

  tag: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  diamond: {
    width: 12,
    height: 12,
    borderWidth: 1.3,
    borderColor: COLORS.green,
    transform: [
      {
        rotate: "45deg",
      },
    ],
    marginRight: 10,
  },

  tagText: {
    color: COLORS.green,
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: "500",
  },

  /* LANDING */

  landingContent: {
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 40,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "700",
    marginBottom: 12,
  },

  heroDescription: {
    color: "#73747B",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 30,
  },

  primaryButton: {
    height: 45,
    borderRadius: 23,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  primaryButtonText: {
    color: "#07120F",
    fontSize: 13,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 45,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#74747A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  signInBottom: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  signInText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  footerText: {
    color: COLORS.white,
    fontSize: 9,
  },

  greenText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "600",
  },

  /* RECEIPT */

  receiptWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  receipt: {
    width: 200,
    minHeight: 300,
    backgroundColor: "#F5F5F5",
    padding: 15,
    transform: [
      {
        rotate: "6deg",
      },
    ],
    elevation: 8,
  },

  receiptTitle: {
    color: "#222",
    textAlign: "center",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 8,
  },

  receiptNumber: {
    color: "#222",
    fontSize: 8,
    textAlign: "center",
    marginVertical: 5,
  },

  receiptLine: {
    borderTopWidth: 1,
    borderColor: "#777",
    borderStyle: "dashed",
    marginVertical: 7,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  receiptText: {
    color: "#222",
    fontSize: 8,
  },

  receiptDate: {
    color: "#222",
    fontSize: 7,
    marginTop: 12,
    textAlign: "center",
  },

  /* HOW */

  howContent: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 35,
  },

  howTitle: {
    color: COLORS.white,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 12,
  },

  stepCard: {
    backgroundColor: COLORS.card,
    minHeight: 87,
    borderRadius: 17,
    marginBottom: 10,
    padding: 13,
    flexDirection: "row",
  },

  stepIcon: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  stepContent: {
    flex: 1,
    paddingLeft: 5,
  },

  stepNumber: {
    color: COLORS.green,
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 3,
  },

  stepTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
  },

  stepDescription: {
    color: "#777880",
    fontSize: 8,
    lineHeight: 11,
  },

  /* AUTH */

  authTop: {
    backgroundColor: COLORS.black,
    minHeight: 310,
  },

  authHero: {
    paddingHorizontal: 36,
    paddingTop: 40,
  },

  signinHero: {
    paddingHorizontal: 36,
    paddingTop: 45,
  },

  authHeroTitle: {
    color: COLORS.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 18,
  },

  authPanel: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingHorizontal: 36,
    paddingTop: 35,
    minHeight: 390,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  authTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },

  authSubtitle: {
    color: "#777880",
    fontSize: 9,
    marginBottom: 27,
  },

  inputContainer: {
    marginBottom: 18,
  },

  inputLabel: {
    color: COLORS.lightGray,
    fontSize: 9,
    marginBottom: 7,
  },

  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#777880",
    color: COLORS.white,
    fontSize: 13,
    paddingVertical: 0,
  },

  authFooter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },

  /* DASHBOARD */

  dashboardPage: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  dashboardHeader: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeSmall: {
    color: COLORS.lightGray,
    fontSize: 9,
    marginBottom: 4,
  },

  dashboardUser: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "700",
  },

  balanceCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  balanceLabel: {
    color: "#777880",
    fontSize: 7,
    letterSpacing: 1,
  },

  balanceAmount: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 5,
  },

  balanceHint: {
    color: COLORS.green,
    fontSize: 7,
    marginTop: 5,
  },

  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 22,
  },

  quickAction: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  quickActionText: {
    color: COLORS.lightGray,
    fontSize: 8,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 9,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  sectionAction: {
    color: COLORS.green,
    fontSize: 7,
  },

  /* CHART */

  chartCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  chartTitle: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "600",
  },

  chartMonth: {
    color: COLORS.green,
    fontSize: 7,
  },

  chartRow: {
    marginBottom: 9,
  },

  chartLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  chartCategory: {
    color: COLORS.lightGray,
    fontSize: 7,
  },

  chartAmount: {
    color: "#888990",
    fontSize: 7,
  },

  progressBackground: {
    height: 4,
    backgroundColor: "#292A31",
    borderRadius: 3,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 3,
  },

  /* TRANSACTIONS */

  recentHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  viewAll: {
    color: COLORS.green,
    fontSize: 8,
  },

  recentContainer: {
    marginHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  transaction: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#272830",
    paddingHorizontal: 4,
  },

  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#202129",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionName: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 3,
  },

  transactionCategory: {
    color: "#73747B",
    fontSize: 7,
  },

  transactionAmount: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "600",
  },

  /* RECORDS */

  recordsTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 15,
  },

  searchBox: {
    marginHorizontal: 20,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2C2D35",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 10,
    marginHorizontal: 8,
  },

  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 10,
  },

  filterButton: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 12,
    marginRight: 5,
  },

  filterButtonActive: {
    backgroundColor: COLORS.green,
  },

  filterText: {
    color: "#85868D",
    fontSize: 6,
  },

  filterTextActive: {
    color: COLORS.black,
    fontWeight: "700",
  },

  dateHeading: {
    color: COLORS.green,
    fontSize: 7,
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 6,
    marginTop: 8,
  },

  emptyText: {
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 40,
    fontSize: 11,
  },

  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 85,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  /* PROFILE */

  profileTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 22,
  },

  profileAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: COLORS.green,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  profileName: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 9,
  },

  profileEmail: {
    color: "#73747B",
    textAlign: "center",
    fontSize: 8,
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 24,
  },

  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
    marginHorizontal: 4,
  },

  statValue: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  statLabel: {
    color: "#777880",
    fontSize: 6,
    marginTop: 4,
  },

  profileSection: {
    color: COLORS.green,
    fontSize: 7,
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 7,
  },

  profileMenu: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
  },

  profileOption: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: "#292A31",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileOptionText: {
    color: COLORS.lightGray,
    fontSize: 9,
    marginLeft: 10,
  },

  /* LOGOUT */

  logoutButton: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.red,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  logoutText: {
    color: COLORS.red,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 8,
  },

  /* BOTTOM NAV */

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 62,
    backgroundColor: "#101117",
    borderTopWidth: 1,
    borderTopColor: "#282931",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom:
      Platform.OS === "ios" ? 5 : 0,
  },

  navItem: {
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  /* MENU */

  menuScreen: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 25,
  },

  menuHeader: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#2B2C32",
    marginBottom: 4,
  },

  menuItem: {
    height: 57,
    borderBottomWidth: 1,
    borderBottomColor: "#55565C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  menuItemText: {
    color: COLORS.white,
    fontSize: 14,
  },

  menuBottom: {
    position: "absolute",
    left: 25,
    right: 25,
    bottom: 30,
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  modalLabel: {
    color: COLORS.lightGray,
    fontSize: 9,
    marginBottom: 7,
  },

  modalInput: {
    height: 42,
    borderWidth: 1,
    borderColor: "#3A3B43",
    borderRadius: 9,
    color: COLORS.white,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 11,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "#25262E",
    marginRight: 6,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.green,
  },

  categoryButtonText: {
    color: COLORS.gray,
    fontSize: 8,
  },

  categoryButtonTextActive: {
    color: COLORS.black,
    fontWeight: "700",
  },

  /* CAMERA */

  scanPhotoButton: {
    height: 45,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  scanPhotoText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 8,
  },

  receiptImageContainer: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#111218",
  },

  receiptImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  removePhoto: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor:
      "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

});
