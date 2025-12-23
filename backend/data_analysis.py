import pandas as pd

def basic_analysis(df: pd.DataFrame):
    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "missing_values_percent": (
            df.isnull().mean() * 100
        ).round(2).to_dict()
    }
