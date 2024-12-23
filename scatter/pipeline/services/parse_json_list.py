import re
import json

COMMA_AND_SPACE_AND_RIGHT_BRACKET = re.compile(r",\s*(\])")

TEST = """Response was: 以下は、提供されたテキストの要約です。

[
  "創作文化は…",
  "生成AIは無断で特徴を抽出…",
  "多くのクリエイターは…",
  "生成AIによるコンテンツは…"
]"""


def parse_response(response):
    """
    指定されたレスポンス文字列からJSON配列を安全に抽出し、パースする。

    以下はdoctestによるテスト例。

    >>> parse_response('以下は...\\n```json\\n["a", "b"]\\n```')
    ['a', 'b']

    >>> parse_response('Response was: なんか説明\\n[ "x", "y" ] さらに何か')
    ['x', 'y']

    >>> parse_response('No json here')
    Traceback (most recent call last):
    ...
    RuntimeError: JSON list not found

    >>> parse_response('["a", "b" , ]')
    ['a', 'b']

    >>> parse_response(TEST)
    ['創作文化は…', '生成AIは無断で特徴を抽出…', '多くのクリエイターは…', '生成AIによるコンテンツは…']

    >>> parse_response('"a"')
    ['a']

    >>> parse_response("[{'議論': 'A'}, {'議論': 'B'}, {'議論': 'C'}]")
    ['A', 'B', 'C']

    >>> parse_response('[]')
    []
    """
    try:
        obj = json.loads(response)
        if isinstance(obj, str):
            obj = [obj]
        items = [a.strip() for a in obj if a.strip()]
        return items
    except:
        # 不要なコードブロックを除去
        response = response.replace("```json", "").replace("```", "")

        # JSON配列部分を抽出
        match = re.search(r"\[.*?\]", response, flags=re.DOTALL)
        if not match:
            # JSON配列が見つからなければraise
            raise RuntimeError("JSON list not found")

        json_str = match.group(0)
        # ", ]" のようなパターンを "]" に置換
        json_str = COMMA_AND_SPACE_AND_RIGHT_BRACKET.sub(r"\1", json_str)

        obj = json.loads(json_str)  # ここでも例外の場合はそのまま外に投げる
        if isinstance(obj, str):
            obj = [obj]
        if obj == []:
            return []
        if isinstance(obj[1], dict):
            obj = [x["議論"] for x in obj]
        try:
            items = [a.strip() for a in obj]
        except Exception as e:
            report(response, json_str, obj, e)
            items = []
        return items


def report(response, json_str, obj, e):
    print("Response was:", response)
    print("JSON was:", json_str)
    print("parsed object was:", obj)
    print(e)
    print("skip")


if __name__ == "__main__":
    import doctest

    doctest.testmod(verbose=True)
