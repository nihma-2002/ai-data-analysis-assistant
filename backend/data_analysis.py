import pandas as pd

def basic_analysis(df: pd.DataFrame):
    # Identify column types
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    categorical_cols = df.select_dtypes(exclude="number").columns.tolist()

    # Basic info
    analysis = {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
        "missing_values_percent": (
            df.isnull().mean() * 100
        ).round(2).to_dict()
    }

    # Summary statistics for numeric columns
    if numeric_cols:
        analysis["summary_statistics"] = (
            df[numeric_cols]
            .describe()
            .round(2)
            .to_dict()
        )
    else:
        analysis["summary_statistics"] = {}

    # Correlation matrix (numeric only)
    if len(numeric_cols) > 1:
        analysis["correlation_matrix"] = (
            df[numeric_cols]
            .corr()
            .round(2)
            .to_dict()
        )
    else:
        analysis["correlation_matrix"] = {}

        # Chart-ready data
    charts = {}

        # Histogram data for numeric columns (limit to first 3)
    for col in numeric_cols[:3]:
        clean_series = pd.to_numeric(df[col], errors="coerce").dropna()

        if clean_series.empty:
            continue

        hist_counts = clean_series.value_counts(bins=10, sort=False)

        charts[col] = {
            "type": "histogram",
            "data": {
                str(interval): int(count)
                for interval, count in hist_counts.items()
            }
        }

    # Bar chart data for categorical columns (top 10 values)
    for col in categorical_cols[:2]:
        value_counts = df[col].value_counts().head(10)
        charts[col] = {
            "type": "bar",
            "data": value_counts.to_dict()
        }

    analysis["charts"] = charts

    return analysis
