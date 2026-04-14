import streamlit as st
import pandas as pd
import joblib
import os

# --- PAGE SETUP ---
st.set_page_config(
    page_title="CineScore Insight — Box Office Oracle",
    page_icon="🎬",
    layout="wide"
)

# --- MINIMAL CSS: Only for metric card polish (no theme overrides) ---
st.markdown("""
    <style>
    div[data-testid="stMetric"] {
        background-color: #1B263B;
        border: 1px solid #2D3748;
        border-radius: 12px;
        padding: 20px 24px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }
    div[data-testid="stMetricLabel"] > div {
        color: #778DA9 !important;
        font-size: 0.78rem !important;
        font-weight: 600 !important;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    div[data-testid="stMetricValue"] > div {
        color: #E0E1DD !important;
        font-size: 1.8rem !important;
        font-weight: 800 !important;
    }
    div[data-testid="stMetricDelta"] > div {
        font-size: 0.9rem !important;
    }
    </style>
""", unsafe_allow_html=True)

# --- MODEL LOADING ---
@st.cache_resource
def load_oracle_model():
    model_path = os.path.join("Model", "cinescore_revenue_predictor_v1.pkl")
    if not os.path.exists(model_path):
        st.error(f"❌ Model not found at {model_path}. Please ensure the file exists.")
        st.stop()
    return joblib.load(model_path)

oracle_model = load_oracle_model()
expected_features = oracle_model.feature_names_in_.tolist()

# --- DYNAMIC FEATURE EXTRACTION ---
genres = sorted([f.replace("primary_genre_", "") for f in expected_features if f.startswith("primary_genre_")])
companies = sorted([f.replace("primary_company_", "") for f in expected_features if f.startswith("primary_company_")])

if not genres:
    genres = ["Action", "Comedy", "Drama"]
if not companies:
    companies = ["Universal Pictures", "Warner Bros. Pictures", "Paramount Pictures"]

# --- SIDEBAR ---
with st.sidebar:
    st.title("🎬 CineScore Oracle")
    st.caption("Configure your cinematic pitch below")
    st.divider()

    input_budget = st.number_input("Budget (USD)", min_value=0, value=100_000_000, step=1_000_000)
    input_runtime = st.slider("Runtime (Minutes)", min_value=60, max_value=240, value=120)

    month_names = {
        1: "January", 2: "February", 3: "March", 4: "April",
        5: "May", 6: "June", 7: "July", 8: "August",
        9: "September", 10: "October", 11: "November", 12: "December"
    }
    input_month = st.selectbox(
        "Release Month",
        options=list(month_names.keys()),
        format_func=lambda x: month_names[x]
    )

    st.divider()
    input_genre = st.selectbox("Primary Genre", options=genres, help="Type to search...")
    input_company = st.selectbox("Production Company", options=companies, help="Type to search...")

    st.caption("💡 Tip: Type directly into the dropdowns to search")
    st.caption("Studio Brand Moat effect is factored in automatically.")
    st.divider()
    predict_btn = st.button("🔮 PREDICT PERFORMANCE", use_container_width=True, type="primary")

# --- MAIN DASHBOARD ---
st.title("🎬 CineScore Insight")
st.caption("Advanced Theatrical Revenue Forecasting — Random Forest Intelligence Engine")
st.divider()

# Always-visible live pitch summary
st.markdown(f"""
### **😎 Current Pitch**
- 🎬 **Genre:** {input_genre}
- 🏢 **Studio:** {input_company}
- 💰 **Budget:** ${input_budget:,.0f}
- ⏱️ **Runtime:** {input_runtime} min
- 📅 **Release Window:** {month_names[input_month]}
""")
st.divider()

# --- INFERENCE ---
if predict_btn:
    with st.spinner("⏳ Synthesizing box office intelligence..."):
        # Build zeroed feature matrix
        input_data = pd.DataFrame(0, index=[0], columns=expected_features)
        input_data.at[0, "budget"] = input_budget
        input_data.at[0, "runtime"] = input_runtime
        input_data.at[0, "release_month"] = input_month

        genre_col = f"primary_genre_{input_genre}"
        company_col = f"primary_company_{input_company}"
        if genre_col in expected_features:
            input_data.at[0, genre_col] = 1
        if company_col in expected_features:
            input_data.at[0, company_col] = 1

        predicted_revenue = oracle_model.predict(input_data.astype("float32"))[0]
        profit = predicted_revenue - input_budget
        roi = (profit / input_budget * 100) if input_budget > 0 else 0

    # KPI Cards
    m1, m2, m3 = st.columns(3)
    m1.metric("Projected Gross Revenue", f"${predicted_revenue:,.0f}")
    m2.metric("Net Profit / Loss", f"${profit:,.0f}", delta=f"{roi:.1f}% ROI")
    m3.metric("ROI Capability", f"{roi:.1f}%")

    st.markdown("##")

    # Financial Anatomy + Verdict
    chart_col, verdict_col = st.columns([1.6, 1])

    with chart_col:
        st.markdown("### 📊 Financial Anatomy")
        chart_df = pd.DataFrame({
            "Stage": ["Production Budget", "Projected Revenue"],
            "Amount (USD)": [input_budget, predicted_revenue]
        })
        st.bar_chart(chart_df, x="Stage", y="Amount (USD)", color="#337AFF")

    with verdict_col:
        st.markdown("### 🔮 The Verdict")
        if roi > 50:
            st.success(
                f"**BLOCKBUSTER POTENTIAL**\n\n"
                f"{input_company} × {input_genre} in {month_names[input_month]} "
                f"— high-yield deployment. Direct green-light recommended."
            )
            st.balloons()
        elif roi > 0:
            st.info(
                f"**COMMERCIALLY VIABLE**\n\n"
                f"Solid {input_genre} market presence. Marginal profitability projected."
            )
        else:
            st.warning(
                "**INVESTMENT HAZARD**\n\n"
                "Revenue falls below budget. Re-evaluate budget scale "
                "or shift the release window."
            )

else:
    st.markdown("""
    #### ***👈 Get Started in the Sidebar:***
    - 💰 Set your **Target Budget**
    - ⏱️ Adjust the **Movie Runtime**
    - 📅 Select your **Release Window**
    - 🎬 Choose **Genre** & **Studio**
    - 🔮 Hit **PREDICT PERFORMANCE** to begin
    """)

# --- FOOTER ---
st.divider()
st.caption("CineScore Intelligence Suite v1.0  ·  Running on Random Forest Champion v1.0")
