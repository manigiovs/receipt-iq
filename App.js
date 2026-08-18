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

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2/receiptiq/api"
    : "http://localhost/receiptiq/api";

const defaultAdminRows = [
  { id: 1, name: "Alice Johnson", email: "alice@receiptiq.com", role: "Admin", status: "Active", department: "Operations" },
  { id: 2, name: "Mark Lee", email: "mark@receiptiq.com", role: "Manager", status: "Active", department: "Finance" },
  { id: 3, name: "Sara Gomez", email: "sara@receiptiq.com", role: "User", status: "Pending", department: "Support" },
  { id: 4, name: "Daniel Cruz", email: "daniel@receiptiq.com", role: "User", status: "Inactive", department: "Sales" },
];

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = async (currentUser) => {
    if (!currentUser?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/get_expenses.php?user_id=${currentUser.id}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setExpenses(result.expenses || []);
      }
    } catch (error) {
      console.log("Load expenses error:", error);
    }
  };

  const addExpense = async (expense) => {
    if (!user?.id) {
      Alert.alert("Login Required", "Please log in before saving expenses.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/save_expense.php`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          name: expense.name,
          category: expense.category,
          amount: expense.amount,
          note: expense.note || "",
          date: expense.date || new Date().toISOString().slice(0, 10),
          image: expense.image || "",
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        Alert.alert("Save Failed", result.message || "Could not save your expense.");
        return;
      }

      const savedExpense = {
        ...result.expense,
        id: result.expense.id || Date.now(),
        amount: Number(result.expense.amount || 0),
        date: result.expense.date || "Today",
      };

      setExpenses((previous) => [savedExpense, ...previous]);
      return savedExpense;
    } catch (error) {
      Alert.alert("Connection Error", "Unable to save the expense. Check that the API server is running.");
      return null;
    }
  };

  const saveExpenseLocally = (expense) => {
    setExpenses((previous) => [
      {
        ...expense,
        id: Date.now(),
        date: "Today",
      },
      ...previous,
    ]);
  };

  const [adminRows, setAdminRows] = useState(defaultAdminRows);

  const navigate = (page) => {
    setMenuVisible(false);
    setScreen(page);
  };

  const handleCreateAccount = async (newUser) => {
    const email = String(newUser.email || "").trim().toLowerCase();
    const password = String(newUser.password || "");

    if (!email || !password) {
      Alert.alert("Account Error", "Please complete all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(newUser.name || "User").trim(),
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        Alert.alert("Account Error", result.message || "Unable to create account.");
        return;
      }

      setUser(result.user);
      setIsSubmitting(false);
      loadExpenses(result.user);
      navigate("dashboard");
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert("Connection Error", "Unable to reach the database server. Check that XAMPP Apache/MySQL is running.");
    }
  };

  const handleLogin = async ({ email, password }) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const passwordValue = String(password || "");

    if (!normalizedEmail || !passwordValue) {
      Alert.alert("Login Failed", "Email or password is incorrect.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: passwordValue,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setIsSubmitting(false);
        Alert.alert("Login Failed", result.message || "Email or password is incorrect.");
        return;
      }

      setUser(result.user);
      setIsSubmitting(false);
      loadExpenses(result.user);
      navigate(result.user.role === "admin" ? "admin" : "dashboard");
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert("Connection Error", "Unable to reach the database server. Check that XAMPP Apache/MySQL is running.");
    }
  };

  const logout = () => {
    setUser(null);
    setMenuVisible(false);
    setScreen("signin");
  };

  const addAdminRecord = (record) => {
    setAdminRows((previous) => [record, ...previous]);
  };

  const editAdminRecord = (id, updatedRecord) => {
    setAdminRows((previous) => previous.map((row) => (row.id === id ? { ...row, ...updatedRecord } : row)));
  };

  const deleteAdminRecord = (id) => {
    setAdminRows((previous) => previous.filter((row) => row.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
      />

      <View style={styles.container}>

        {screen === "landing" && (
          <LandingScreen
            onMenu={() => setMenuVisible(true)}
            onCreate={() => navigate("create")}
            onSignIn={() => navigate("signin")}
            onHow={() => navigate("how")}
          />
        )}

        {screen === "how" && (
          <HowItWorksScreen
            onMenu={() => setMenuVisible(true)}
            onCreate={() => navigate("create")}
            onSignIn={() => navigate("signin")}
          />
        )}

        {screen === "create" && (
          <CreateAccountScreen
            onBack={() => navigate("landing")}
            onSignIn={() => navigate("signin")}
            onCreate={handleCreateAccount}
          />
        )}

        {screen === "signin" && (
          <SignInScreen
            onBack={() => navigate("landing")}
            onCreate={() => navigate("create")}
            onLogin={handleLogin}
          />
        )}

        {(screen === "dashboard" || screen === "user") && (
          <DashboardScreen
            user={user}
            expenses={expenses}
            onNavigate={navigate}
            onAddExpense={async (expense) => {
              const saved = await addExpense(expense);
              if (!saved) {
                saveExpenseLocally(expense);
              }
            }}
          />
        )}

        {(screen === "admin" || screen === "adminDashboard") && (
          <AdminDashboardScreen
            user={user}
            rows={adminRows}
            onLogout={logout}
            onAddRecord={addAdminRecord}
            onEditRecord={editAdminRecord}
            onDeleteRecord={deleteAdminRecord}
          />
        )}

        {screen === "records" && (
          <RecordsScreen
            user={user}
            expenses={expenses}
            onNavigate={navigate}
            onAddExpense={async (expense) => {
              const saved = await addExpense(expense);
              if (!saved) {
                saveExpenseLocally(expense);
              }
            }}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            user={user}
            onNavigate={navigate}
            onLogout={logout}
          />
        )}

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
      `</Text>

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
      password,
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
            title={isSubmitting ? "Creating..." : "Create Account"}
            onPress={createAccount}
            disabled={isSubmitting}
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
      password,
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
            title={isSubmitting ? "Signing In..." : "Sign In"}
            onPress={login}
            disabled={isSubmitting}
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
  const [scanModalVisible, setScanModalVisible] =
    useState(false);
  const [addModalVisible, setAddModalVisible] =
    useState(false);

  const handleNavigate = (page) => {
    // Prevent users from accessing admin pages
    if (user?.role === "user" && (page === "admin" || page === "adminDashboard")) {
      Alert.alert("Access Denied", "You don't have permission to access the admin panel.");
      return;
    }
    onNavigate(page);
  };

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
              setScanModalVisible(true)
            }
          />

          <QuickAction
            icon="add-circle-outline"
            title="Add"
            onPress={() =>
              setAddModalVisible(true)
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
              handleNavigate("records")
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
        onNavigate={handleNavigate}
      />

      <AddExpenseModal
        visible={scanModalVisible}
        onClose={() =>
          setScanModalVisible(false)
        }
        onAdd={(expense) => {
          onAddExpense(expense);
          setScanModalVisible(false);
        }}
      />

      <AddReceiptModal
        visible={addModalVisible}
        onClose={() =>
          setAddModalVisible(false)
        }
        onAdd={(expense) => {
          onAddExpense(expense);
          setAddModalVisible(false);
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
  user,
  expenses,
  onNavigate,
  onAddExpense,
}) {
  const [search, setSearch] =
    useState("");

  const [addModalVisible, setAddModalVisible] =
    useState(false);

  const handleNavigate = (page) => {
    // Prevent users from accessing admin pages
    if (user?.role === "user" && (page === "admin" || page === "adminDashboard")) {
      Alert.alert("Access Denied", "You don't have permission to access the admin panel.");
      return;
    }
    onNavigate(page);
  };

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
          setAddModalVisible(true)
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
        onNavigate={handleNavigate}
      />

      <AddReceiptModal
        visible={addModalVisible}
        onClose={() =>
          setAddModalVisible(false)
        }
        onAdd={(expense) => {
          onAddExpense(expense);
          setAddModalVisible(false);
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
  const handleNavigate = (page) => {
    // Prevent users from accessing admin pages
    if (user?.role === "user" && (page === "admin" || page === "adminDashboard")) {
      Alert.alert("Access Denied", "You don't have permission to access the admin panel.");
      return;
    }
    onNavigate(page);
  };

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
        onNavigate={handleNavigate}
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
   ADMIN DASHBOARD
========================================================= */

function AdminDashboardScreen({
  user,
  rows,
  onLogout,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentTab, setCurrentTab] = useState("dashboard"); // dashboard, users, aiActivity
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
    department: "Operations",
  });

  const activeUsers = rows.filter((row) => row.status === "Active").length;
  const pendingUsers = rows.filter((row) => row.status === "Pending").length;

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", email: "", role: "User", status: "Active", department: "Operations" });
    setModalVisible(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      department: row.department,
    });
    setModalVisible(true);
  };

  const saveRecord = () => {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert("Missing info", "Name and email are required.");
      return;
    }

    if (editingId) {
      onEditRecord(editingId, { ...form, name: form.name.trim(), email: form.email.trim() });
    } else {
      onAddRecord({
        ...form,
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
      });
    }

    setModalVisible(false);
    setEditingId(null);
    setForm({ name: "", email: "", role: "User", status: "Active", department: "Operations" });
  };

  const deleteRecord = (id) => {
    Alert.alert("Delete user", "Are you sure you want to remove this record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDeleteRecord(id) },
    ]);
  };

  return (
    <View style={styles.dashboardPage}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Dashboard Tab */}
        {currentTab === "dashboard" && (
          <>
            {/* Header with Greeting and Logout */}
            <View style={styles.adminGreetingHeader}>
              <View>
                <Text style={styles.adminGreeting}>{user?.name || "Admin User"}</Text>
                <View style={styles.adminBadgeRow}>
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={onLogout} style={styles.adminHeaderLogout}>
                <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
              </TouchableOpacity>
            </View>

            {/* Key Statistics */}
            <View style={styles.adminStatRow}>
              <AdminStatItem label="TOTAL USERS" value={String(rows.length)} />
              <AdminStatItem label="TOTAL REVENUE" value="₱1.25M" />
              <AdminStatItem label="TOTAL ORDERS" value={String(activeUsers)} />
              <AdminStatItem label="DEPT STATUS" value="OPERATIONAL" color={COLORS.green} />
            </View>

            {/* Chart Visualization */}
            <View style={styles.adminChartCard}>
              <Text style={styles.adminChartTitle}>Overview</Text>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartBars}>
                  <View style={[styles.chartBar, { height: '30%', backgroundColor: COLORS.green }]} />
                  <View style={[styles.chartBar, { height: '50%', backgroundColor: COLORS.green }]} />
                  <View style={[styles.chartBar, { height: '40%', backgroundColor: COLORS.green }]} />
                  <View style={[styles.chartBar, { height: '60%', backgroundColor: COLORS.green }]} />
                  <View style={[styles.chartBar, { height: '45%', backgroundColor: COLORS.green }]} />
                </View>
              </View>
            </View>

            {/* AI Processing Activity */}
            <View style={styles.adminSection}>
              <Text style={styles.adminSectionTitle}>AI Processing Activity</Text>
              {rows.slice(0, 3).map((row, idx) => (
                <View key={row.id} style={styles.activityRow}>
                  <Ionicons 
                    name={idx === 0 ? "checkmark-circle-outline" : idx === 1 ? "alert-circle-outline" : "time-outline"} 
                    size={18} 
                    color={idx === 0 ? COLORS.green : idx === 1 ? COLORS.yellow : COLORS.blue} 
                  />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>{row.name}</Text>
                    <Text style={styles.activityDept}>{row.department}</Text>
                  </View>
                  <Text style={[styles.activityStatus, { color: idx === 0 ? COLORS.green : idx === 1 ? COLORS.yellow : COLORS.blue }]}>
                    {idx === 0 ? "Success" : idx === 1 ? "Warning" : "Processing"}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* User Management Tab */}
        {currentTab === "users" && (
          <View style={styles.adminSection}>
            <View style={styles.userManagementHeader}>
              <Text style={styles.adminSectionTitle}>User Management</Text>
              <TouchableOpacity style={styles.addUserButton} onPress={openCreate}>
                <Ionicons name="add-circle-outline" size={20} color={COLORS.black} />
                <Text style={styles.addUserText}>Add User</Text>
              </TouchableOpacity>
            </View>

            {/* CRUD Table */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHead, { flex: 2 }]}>Name</Text>
                <Text style={[styles.tableHead, { flex: 2 }]}>Email</Text>
                <Text style={[styles.tableHead, { flex: 1.2 }]}>Role</Text>
                <Text style={[styles.tableHead, { flex: 1.2 }]}>Status</Text>
                <Text style={[styles.tableHead, { flex: 1.5 }]}>Actions</Text>
              </View>

              {rows.map((row) => (
                <View key={row.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{row.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2, color: COLORS.gray, fontSize: 7 }]}>{row.email}</Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>{row.role}</Text>
                  <View style={{ flex: 1.2, justifyContent: 'center' }}>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: row.status === "Active" ? "rgba(25, 179, 148, 0.2)" : 
                                      row.status === "Pending" ? "rgba(233, 185, 75, 0.2)" : 
                                      "rgba(146, 147, 154, 0.2)"
                    }]}>
                      <Text style={[styles.statusBadgeText, {
                        color: row.status === "Active" ? COLORS.green : 
                               row.status === "Pending" ? COLORS.yellow : 
                               COLORS.gray
                      }]}>
                        {row.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowActionGroup}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openEdit(row)}
                    >
                      <Text style={styles.rowActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteRecord(row.id)}
                    >
                      <Text style={[styles.rowActionText, { color: COLORS.red }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Processing Activity Tab */}
        {currentTab === "aiActivity" && (
          <View style={styles.adminSection}>
            <Text style={styles.adminSectionTitle}>AI Processing Activity</Text>
            <View style={styles.aiActivityContainer}>
              {rows.map((row, idx) => (
                <View key={row.id} style={styles.aiActivityCard}>
                  <View style={styles.aiActivityHeader}>
                    <View style={styles.aiActivityIconWrapper}>
                      <Ionicons 
                        name={idx % 3 === 0 ? "checkmark-circle-outline" : idx % 3 === 1 ? "alert-circle-outline" : "time-outline"} 
                        size={24} 
                        color={idx % 3 === 0 ? COLORS.green : idx % 3 === 1 ? COLORS.yellow : COLORS.blue}
                      />
                    </View>
                    <View style={styles.aiActivityTitle}>
                      <Text style={styles.aiActivityName}>{row.name}</Text>
                      <Text style={styles.aiActivityDept}>{row.department}</Text>
                    </View>
                  </View>
                  <View style={styles.aiActivityFooter}>
                    <Text style={[styles.aiActivityBadge, {
                      color: idx % 3 === 0 ? COLORS.green : idx % 3 === 1 ? COLORS.yellow : COLORS.blue,
                      borderColor: idx % 3 === 0 ? COLORS.green : idx % 3 === 1 ? COLORS.yellow : COLORS.blue
                    }]}>
                      {idx % 3 === 0 ? "✓ Completed" : idx % 3 === 1 ? "⚠ Warning" : "⏳ Processing"}
                    </Text>
                    <Text style={styles.aiActivityTime}>2 min ago</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Profile Tab */}
        {currentTab === "profile" && (
          <View style={{ paddingHorizontal: 0 }}>
            {/* Profile Header */}
            <Text style={styles.profileTitle}>Profile</Text>

            {/* Avatar */}
            <View style={styles.profileAvatar}>
              <Ionicons name="person-outline" size={50} color={COLORS.green} />
            </View>

            {/* Name and Email */}
            <Text style={styles.profileName}>{user?.name || "Admin"}</Text>
            <Text style={styles.profileEmail}>{user?.email || "admin@receiptiq.com"}</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <Stat label="RECEIPTS" value="142" />
              <Stat label="TOTAL SPENT" value="₱2,340" />
              <Stat label="DAYS ACTIVE" value="18" />
            </View>

            {/* Account Section */}
            <Text style={styles.profileSection}>ACCOUNT</Text>
            <View style={styles.profileMenu}>
              <ProfileOption icon="create-outline" title="Edit Profile" />
              <ProfileOption icon="options-outline" title="Preferences" />
              <ProfileOption icon="shield-checkmark-outline" title="Security" />
            </View>

            {/* Support Section */}
            <Text style={styles.profileSection}>SUPPORT</Text>
            <View style={styles.profileMenu}>
              <ProfileOption icon="help-circle-outline" title="Help & Support" />
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert("Log Out", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Log Out",
                    style: "destructive",
                    onPress: onLogout,
                  },
                ]);
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <AdminBottomNavigation
        active={currentTab}
        onNavigate={setCurrentTab}
      />

      <AdminUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveRecord}
        onChange={setForm}
        form={form}
        title={editingId ? "Edit User" : "Create User"}
      />
    </View>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <View style={[styles.statCard, { borderColor: accent }]}>
      <Text style={[styles.statCardValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
  );
}

function AdminStatItem({ label, value, color = COLORS.green }) {
  return (
    <View style={styles.adminStatItem}>
      <Text style={styles.adminStatValue}>{value}</Text>
      <Text style={styles.adminStatLabel}>{label}</Text>
    </View>
  );
}

function SettingToggle({ label, value, onToggle }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggleSwitch, { backgroundColor: value ? COLORS.green : COLORS.gray }]}
        onPress={onToggle}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX: value ? 20 : 0 }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

function AdminUserModal({ visible, onClose, onSave, onChange, form, title }) {
  const updateField = (field, value) => onChange((prev) => ({ ...prev, [field]: value }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Name</Text>
          <TextInput style={styles.modalInput} value={form.name} onChangeText={(text) => updateField("name", text)} placeholder="Enter full name" placeholderTextColor="#66676E" />

          <Text style={styles.modalLabel}>Email</Text>
          <TextInput style={styles.modalInput} value={form.email} onChangeText={(text) => updateField("email", text)} placeholder="name@email.com" placeholderTextColor="#66676E" keyboardType="email-address" />

          <Text style={styles.modalLabel}>Role</Text>
          <TextInput style={styles.modalInput} value={form.role} onChangeText={(text) => updateField("role", text)} placeholder="Admin / User / Manager" placeholderTextColor="#66676E" />

          <Text style={styles.modalLabel}>Status</Text>
          <TextInput style={styles.modalInput} value={form.status} onChangeText={(text) => updateField("status", text)} placeholder="Active / Pending / Inactive" placeholderTextColor="#66676E" />

          <Text style={styles.modalLabel}>Department</Text>
          <TextInput style={styles.modalInput} value={form.department} onChangeText={(text) => updateField("department", text)} placeholder="Operations" placeholderTextColor="#66676E" />

          <PrimaryButton title="Save" onPress={onSave} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
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

/* =========================================================
   ADMIN BOTTOM NAVIGATION
========================================================= */

function AdminBottomNavigation({
  active,
  onNavigate,
}) {
  return (
    <View style={styles.bottomNav}>

      <NavItem
        icon="home-outline"
        activeIcon="home"
        active={active === "dashboard"}
        onPress={() => onNavigate("dashboard")}
      />

      <NavItem
        icon="people-outline"
        activeIcon="people"
        active={active === "users"}
        onPress={() => onNavigate("users")}
      />

      <NavItem
        icon="flash-outline"
        activeIcon="flash"
        active={active === "aiActivity"}
        onPress={() => onNavigate("aiActivity")}
      />

      <NavItem
        icon="person-outline"
        activeIcon="person"
        active={active === "profile"}
        onPress={() => onNavigate("profile")}
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
   ADD RECEIPT MODAL
========================================================= */

function AddReceiptModal({
  visible,
  onClose,
  onAdd,
}) {
  const [store, setStore] = useState("");
  const [amount, setAmount] = useState("240.00");
  const [category, setCategory] = useState("Shopping");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("September 15, 2026");
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);

  const categoryOptions = [
    { label: "Category", value: "Shopping", icon: "cart-outline" },
    { label: "Food", value: "Food & Dining", icon: "restaurant-outline" },
    { label: "Fun", value: "Entertainment", icon: "game-controller-outline" },
    { label: "Travel", value: "Transportation", icon: "car-outline" },
  ];

  const dayOptions = Array.from({ length: 31 }, (_, index) => index + 1);
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2026");

  const submit = () => {
    const numericAmount = Number(
      String(amount).replace(/[^\d.-]/g, "")
    );

    if (!store.trim()) {
      Alert.alert(
        "Missing Information",
        "Enter the store or description."
      );
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
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
      note: note.trim(),
      date,
    });

    setStore("");
    setAmount("240.00");
    setNote("");
    setCategory("Shopping");
    setSelectedDay(15);
    setSelectedMonth("September");
    setSelectedYear("2026");
    setDate("September 15, 2026");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.addModalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.addModalCard}>
          <View style={styles.addModalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>

            <Text style={styles.addModalTitle}>Add Receipt</Text>

            <View style={{ width: 34 }} />
          </View>

          <Text style={styles.addAmountLabel}>PRICE</Text>
          <TextInput
            style={styles.addAmountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="₱240.00"
            placeholderTextColor="#8C8D92"
            keyboardType="decimal-pad"
          />

          <View style={styles.addCategoryRow}>
            {categoryOptions.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.addCategoryOption,
                  category === item.value && styles.addCategoryOptionActive,
                ]}
                onPress={() => setCategory(item.value)}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={category === item.value ? COLORS.black : COLORS.white}
                />
                <Text
                  style={[
                    styles.addCategoryText,
                    category === item.value && styles.addCategoryTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.addFieldLabel}>Merchant</Text>
          <TextInput
            style={styles.addFieldInput}
            value={store}
            onChangeText={setStore}
            placeholder="e.g. Starbucks"
            placeholderTextColor="#66676E"
          />

          <Text style={styles.addFieldLabel}>Add a note...</Text>
          <TextInput
            style={styles.addFieldInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor="#66676E"
          />

          <Text style={styles.addFieldLabel}>Date</Text>
          <View style={styles.addDateWrapper}>
            <TouchableOpacity
              style={styles.addSelectWrapper}
              onPress={() => setShowDateSheet(true)}
            >
              <Text style={styles.addSelectText}>{date}</Text>
              <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <PrimaryButton title="Save Expense" onPress={submit} />
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showDateSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateSheet(false)}
      >
        <View style={styles.dateSheetOverlay}>
          <View style={styles.dateSheetCard}>
            <View style={styles.dateSheetHandle} />

            <View style={styles.dateSheetHeader}>
              <Text style={styles.dateSheetTitle}>Select date</Text>
              <TouchableOpacity onPress={() => setShowDateSheet(false)}>
                <Ionicons name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.addDateDropdown}>
              <View style={styles.addDateColumnHeaderRow}>
                <Text style={styles.addDateColumnHeader}>Day</Text>
                <Text style={styles.addDateColumnHeader}>Month</Text>
                <Text style={styles.addDateColumnHeader}>Year</Text>
              </View>

              <View style={styles.addDateColumnRow}>
                <ScrollView
                  style={styles.addDateColumn}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.addDateColumnContent}
                >
                  {dayOptions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.addDateOption,
                        selectedDay === item && styles.addDateOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedDay(item);
                        const nextDate = `${selectedMonth} ${item}, ${selectedYear}`;
                        setDate(nextDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.addDateOptionText,
                          selectedDay === item && styles.addDateOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <ScrollView
                  style={styles.addDateColumn}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.addDateColumnContent}
                >
                  {monthOptions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.addDateOption,
                        selectedMonth === item && styles.addDateOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(item);
                        const nextDate = `${item} ${selectedDay}, ${selectedYear}`;
                        setDate(nextDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.addDateOptionText,
                          selectedMonth === item && styles.addDateOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.yearInputColumn}>
                  <TextInput
                    style={styles.yearInput}
                    value={selectedYear}
                    onChangeText={(value) => {
                      const cleaned = value.replace(/\D/g, "").slice(0, 4);
                      setSelectedYear(cleaned || "");
                      if (cleaned) {
                        const nextDate = `${selectedMonth} ${selectedDay}, ${cleaned}`;
                        setDate(nextDate);
                      }
                    }}
                    placeholder="2026"
                    placeholderTextColor="#7E7F85"
                    keyboardType="numeric"
                    maxLength={4}
                    textAlign="center"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dateSheetDoneButton}
              onPress={() => setShowDateSheet(false)}
            >
              <Text style={styles.dateSheetDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

/* =========================================================
   BUTTONS
========================================================= */

function PrimaryButton({
  title,
  onPress,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
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
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.secondaryButton, disabled && styles.secondaryButtonDisabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
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

  primaryButtonDisabled: {
    opacity: 0.7,
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

  secondaryButtonDisabled: {
    opacity: 0.7,
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
    marginBottom: 16,
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
    marginTop: 24,
    marginBottom: 12,
  },

  profileName: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 4,
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
    marginTop: 20,
    marginBottom: 28,
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
    marginBottom: 10,
    marginTop: 6,
    fontWeight: "700",
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
    borderWidth: 1.5,
    borderColor: COLORS.red,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
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

  addModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  addModalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
  },

  addModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  addModalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  closeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  addAmountLabel: {
    color: COLORS.gray,
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
    textAlign: "center",
  },

  addAmountInput: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    paddingVertical: 4,
    marginBottom: 18,
    textAlign: "center",
  },

  addCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  addCategoryOption: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#252830",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  addCategoryOptionActive: {
    backgroundColor: COLORS.green,
  },

  addCategoryText: {
    color: COLORS.white,
    fontSize: 8,
    marginTop: 4,
  },

  addCategoryTextActive: {
    color: COLORS.black,
    fontWeight: "700",
  },

  addFieldLabel: {
    color: COLORS.lightGray,
    fontSize: 9,
    marginBottom: 7,
    marginTop: 10,
  },

  addFieldInput: {
    height: 42,
    borderWidth: 1,
    borderColor: "#3A3B43",
    borderRadius: 9,
    color: COLORS.white,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 11,
  },

  addDateWrapper: {
    marginBottom: 18,
    zIndex: 2,
  },

  addSelectWrapper: {
    height: 42,
    borderWidth: 1,
    borderColor: "#3A3B43",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#21232A",
  },

  addSelectText: {
    color: COLORS.white,
    fontSize: 11,
  },

  dateSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  dateSheetCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
  },

  dateSheetHandle: {
    width: 42,
    height: 4,
    backgroundColor: "#4B4D56",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },

  dateSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  dateSheetTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  dateSheetDoneButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  dateSheetDoneText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: "700",
  },

  addDateDropdown: {
    backgroundColor: "#1B1D24",
    borderWidth: 1,
    borderColor: "#3A3B43",
    borderRadius: 9,
    padding: 6,
    maxHeight: 220,
  },

  addDateColumnHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 8,
  },

  addDateColumnHeader: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  addDateColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  addDateColumn: {
    flex: 1,
    maxHeight: 180,
    paddingHorizontal: 2,
  },

  addDateColumnContent: {
    paddingBottom: 6,
  },

  addDateOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
    alignItems: "center",
  },

  yearInputColumn: {
    flex: 1,
    maxHeight: 180,
    justifyContent: "center",
    paddingHorizontal: 2,
  },

  yearInput: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#252830",
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 0,
  },

  addDateOptionSelected: {
    backgroundColor: COLORS.green,
  },

  addDateOptionText: {
    color: COLORS.white,
    fontSize: 10,
  },

  addDateOptionTextSelected: {
    color: COLORS.black,
    fontWeight: "700",
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

  adminScroll: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  adminHeader: {
    paddingTop: 25,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  adminLogoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  adminStatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  statCardValue: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },

  statCardLabel: {
    color: COLORS.lightGray,
    fontSize: 8,
    letterSpacing: 1,
  },

  adminPanel: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },

  adminPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  adminPanelTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  addUserButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  addUserText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 10,
    marginLeft: 4,
  },

  tableHeaderRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2E36",
  },

  tableHead: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 7,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2E36",
  },

  tableCell: {
    flex: 1,
    color: COLORS.white,
    fontSize: 8,
    paddingRight: 4,
  },

  rowActionGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editButton: {
    backgroundColor: "#2B3348",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: "rgba(255,69,69,0.15)",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 8,
  },

  rowActionText: {
    color: COLORS.white,
    fontSize: 7,
    fontWeight: "700",
  },

  /* ADMIN DASHBOARD REDESIGN */

  adminGreetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  adminGreeting: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
  },

  adminBadgeRow: {
    flexDirection: "row",
  },

  adminBadge: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  adminBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  adminHeaderLogout: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,69,69,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  adminStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  adminStatItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },

  adminStatValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 6,
  },

  adminStatLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: COLORS.gray,
    letterSpacing: 1,
  },

  adminChartCard: {
    marginHorizontal: 15,
    marginVertical: 15,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },

  adminChartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 16,
  },

  chartPlaceholder: {
    height: 140,
    backgroundColor: "rgba(25, 179, 148, 0.08)",
    borderRadius: 10,
    padding: 12,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  chartBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    width: "100%",
  },

  chartBar: {
    width: 12,
    borderRadius: 4,
  },

  adminSection: {
    marginHorizontal: 15,
    marginVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },

  adminSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 12,
  },

  recentUserRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 2,
  },

  userRole: {
    fontSize: 10,
    color: COLORS.gray,
  },

  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },

  activityName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 2,
  },

  activityDept: {
    fontSize: 10,
    color: COLORS.gray,
  },

  activityStatus: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.green,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  categoryText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
    marginLeft: 12,
  },

  categoryAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.green,
  },

  addCategoryButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },

  addCategoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.green,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  settingLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },

  toggleSwitch: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },

  manageAllUsersButton: {
    marginHorizontal: 15,
    marginVertical: 20,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  manageAllUsersText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "700",
  },

  /* USER MANAGEMENT STYLES */

  userManagementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  addUserButton: {
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  addUserText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 10,
    marginLeft: 4,
  },

  tableContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },

  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },

  tableHead: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center",
  },

  tableCell: {
    flex: 1,
    color: COLORS.white,
    fontSize: 9,
    paddingRight: 4,
  },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  statusBadgeText: {
    fontSize: 8,
    fontWeight: "700",
  },

  rowActionGroup: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editButton: {
    backgroundColor: "#2B3348",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  deleteButton: {
    backgroundColor: "rgba(255,69,69,0.15)",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  rowActionText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "700",
  },

  /* AI ACTIVITY STYLES */

  aiActivityContainer: {
    gap: 12,
  },

  aiActivityCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
  },

  aiActivityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  aiActivityIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(25, 179, 148, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  aiActivityTitle: {
    flex: 1,
  },

  aiActivityName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 3,
  },

  aiActivityDept: {
    fontSize: 10,
    color: COLORS.gray,
  },

  aiActivityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiActivityBadge: {
    fontSize: 9,
    fontWeight: "700",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  aiActivityTime: {
    fontSize: 9,
    color: COLORS.gray,
  },

});