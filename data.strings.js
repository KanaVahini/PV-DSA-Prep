// ============================================================
// DSA Strings — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["strings"] so
// multiple topic files can coexist without clashing on names.
//
// Grouped by the shape of the technique itself (two-pointer
// reversal, frequency hashing, structural one-pass tricks,
// scan-and-rebuild, stack-based bracket matching) rather than
// by source difficulty label — so problems that share a
// skeleton sit together and revise as a set.
// ============================================================
(function () {

const TOPIC = {
  id: "strings",
  title: "Strings",
  tagline: "Most string problems reduce to one of a few moves: walk two pointers inward, count characters into a hash map, exploit a structural trick specific to the problem, or scan-and-rebuild in a single pass. Spot the move, and the problem mostly writes itself."
};

const PATTERNS = [
  {
    id: "string-two-pointer",
    name: "Two-Pointer Reversal & Palindrome Checks",
    color: "#60a5fa",
    icon: "string-two-pointer",
    trigger: "Working inward from both ends of a string (or a chunk of it) — swapping characters, or just comparing them",
    summary: "Two pointers start at the edges of a range and walk toward each other. Whether that walk SWAPS characters (reversal) or just COMPARES them (palindrome check) is the only difference between these two problems — same loop shape, different action inside it.",
    problems: [
      {
        name: "Reverse a String II",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/reverse-string-ii/",
        idea: "Walk through the string in blocks of size 2k. For each block, reverse only its first min(k, remaining length) characters using two pointers converging inward, and leave the next up-to-k characters untouched. Advancing by 2k each iteration naturally alternates 'reverse a chunk' / 'skip a chunk' with no extra bookkeeping needed.",
        time: "O(n)", space: "O(1) extra, in place",
        code: `string reverseStr(string s, int k) {
    int n = s.size();
    for (int i = 0; i < n; i += 2 * k) {
        int l = i, r = min(i + k, n) - 1;
        while (l < r) swap(s[l++], s[r--]);
    }
    return s;
}`,
        variations: ["Reverse the ENTIRE string with this same two-pointer swap and no chunking — the k = string-length special case.", "Palindrome Check, right below, walks the exact same two pointers inward, but compares instead of swapping."],
        gotchas: ["`min(i + k, n) - 1` handles the last, possibly-shorter-than-k chunk correctly — dropping the `min` and always reversing a full k characters reads/writes past the end of the string on the final block."]
      },
      {
        name: "Palindrome Check",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-palindrome/",
        idea: "Two pointers start at both ends of the string and walk inward. At every step, compare the characters they point at — if they ever differ, the string can't be a palindrome, so return false immediately. If the pointers meet or cross without a mismatch, every character matched its mirror, so the string is a palindrome.",
        time: "O(n)", space: "O(1)",
        code: `bool isPalindrome(const string& s) {
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++; r--;
    }
    return true;
}`,
        variations: ["A version that first strips non-alphanumeric characters and ignores case — same two pointers, with a skip-invalid-character step added.", "Checking whether a string can be REARRANGED into a palindrome is a character-COUNT question instead (see the frequency-hashing group below), not a two-pointer one."],
        gotchas: ["Returning false the instant `s[l] != s[r]` is found (rather than finishing the scan) avoids wasted comparisons once a single mismatch settles the answer."]
      }
    ]
  },

  {
    id: "string-frequency",
    name: "Character Frequency Hashing",
    color: "#c084fc",
    icon: "string-frequency",
    trigger: "The answer only depends on HOW OFTEN each character appears (or a consistent pairing between characters), not on any specific ordering",
    summary: "All three of these count characters into a hash map or fixed-size array first, and answer the question purely from those counts — no comparing substrings, no scanning back and forth. What differs is what's done with the counts afterward: compare two count-maps for equality, track a two-way mapping between characters, or sort characters by their counts.",
    problems: [
      {
        name: "Valid Anagram",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-anagram/",
        idea: "Two strings are anagrams exactly when they contain the same characters the same number of times, regardless of order. Count how many times each character appears in the first string, then walk the second string decrementing those same counts — if every count lands back on exactly zero, the multisets of characters matched.",
        time: "O(n)", space: "O(1) — a fixed 26-size array",
        code: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;
    for (char c : t) freq[c - 'a']--;
    for (int f : freq) if (f != 0) return false;
    return true;
}`,
        variations: ["Group Anagrams — bucket a whole list of strings by their sorted (or frequency-signature) form, using this exact same counting idea as the grouping key.", "Isomorphic String, right below, looks similar on the surface but checks a POSITIONAL character mapping, not just matching total counts."],
        gotchas: ["Sorting both strings and comparing (`sort(s) == sort(t)`) also works and is simpler to write, but costs O(n log n) against this approach's O(n) — worth knowing both, but prefer counting when performance matters."]
      },
      {
        name: "Isomorphic String",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/isomorphic-strings/",
        idea: "Two strings are isomorphic if there's a consistent one-to-one mapping from every character in the first string to a character in the second, and back. Walk both strings together, maintaining TWO hash maps — one for 'char in s maps to char in t', one for the reverse. At each position, if either mapping already exists and disagrees with what's seen now, the strings aren't isomorphic; if neither exists yet, create both.",
        time: "O(n)", space: "O(1) — at most 256 distinct characters possible",
        code: `bool isIsomorphic(string s, string t) {
    if (s.size() != t.size()) return false;
    unordered_map<char, char> mapST, mapTS;
    for (int i = 0; i < (int)s.size(); i++) {
        char a = s[i], b = t[i];
        if (mapST.count(a) && mapST[a] != b) return false;
        if (mapTS.count(b) && mapTS[b] != a) return false;
        mapST[a] = b;
        mapTS[b] = a;
    }
    return true;
}`,
        variations: ["Valid Anagram above also compares two strings character-by-character, but only cares about total counts — a much weaker condition than this positional mapping."],
        gotchas: ["Checking only ONE direction of the mapping (s → t) misses cases where two DIFFERENT characters in s both try to map to the SAME character in t — the second hash map (t → s) is what catches that."]
      },
      {
        name: "Sort Characters by Frequency",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sort-characters-by-frequency/",
        idea: "Count how often each character appears — the same hash-map pass as Valid Anagram — then output every character grouped together, most-frequent groups first. The only new step beyond counting is sorting the distinct characters by their counts (descending) and writing each one out `count` times in that order.",
        time: "O(n + k log k), where k is the number of distinct characters", space: "O(n) for the output, plus O(k) for the frequency map",
        code: `string frequencySort(string s) {
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;

    vector<pair<char, int>> chars(freq.begin(), freq.end());
    sort(chars.begin(), chars.end(), [](auto& a, auto& b) {
        return a.second > b.second;
    });

    string res;
    for (auto& [ch, count] : chars) {
        res.append(count, ch);
    }
    return res;
}`,
        variations: ["Bucket sort by frequency instead of comparison-sort: since a count can be at most n, use n+1 buckets indexed by count and place each character in bucket[count] — turns the k log k sort into O(n) overall."],
        gotchas: ["`string::append(count, ch)` writes `ch` repeated `count` times in a single call — building the same result character-by-character in a loop works too, just less directly."]
      }
    ]
  },

  {
    id: "string-structural-trick",
    name: "Structural One-Pass Tricks",
    color: "#fbbf24",
    icon: "string-structural-trick",
    trigger: "A single, specific observation about the string's structure turns the whole problem into one simple pass — no heavy algorithm needed",
    summary: "No shared code skeleton here — what these three share is a mindset: each has one clever structural fact that reduces the whole problem to a short, direct pass, rather than something more elaborate. Spotting the fact IS the solution.",
    problems: [
      {
        name: "Largest Odd Number in a String",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/largest-odd-number-in-string/",
        idea: "A number is odd exactly when its LAST digit is odd, and any prefix of a numeric string is itself a valid number. So the longest odd-valued prefix is found by scanning from the RIGHT end of the string for the first digit that's odd, then keeping everything up to and including that position — everything after it gets dropped, since keeping it would leave the number ending in an even digit.",
        time: "O(n)", space: "O(n) for the returned substring",
        code: `string largestOddNumber(string s) {
    for (int i = (int)s.size() - 1; i >= 0; i--) {
        if ((s[i] - '0') % 2 == 1) return s.substr(0, i + 1);
    }
    return "";
}`,
        variations: ["The same right-to-left scan idea generalizes to 'find the longest prefix satisfying property X', whenever X only depends on the prefix's LAST character."],
        gotchas: ["Scanning from the LEFT instead and stopping at the first odd digit found gives a much shorter (and usually wrong) answer — the property needed is about the prefix's LAST digit, so the search has to start from the right."]
      },
      {
        name: "Longest Common Prefix",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/longest-common-prefix/",
        idea: "Take the first string as an initial guess for the common prefix, then repeatedly compare it against every other string, trimming it down character by character whenever it stops matching. Since the true common prefix can never be longer than the shortest string in the array, and every trim only shrinks the answer, this converges to the exact longest common prefix (or the empty string, the moment nothing is left in common).",
        time: "O(S), where S is the total character count across all strings, worst case", space: "O(m) for the prefix (m = shortest string length)",
        code: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    string prefix = strs[0];
    for (int i = 1; i < (int)strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix.pop_back();
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}`,
        variations: ["Divide-and-conquer: find the LCP of the first half and second half of the array separately, then find the LCP of those two results — same idea, different recursion shape.", "Vertical scanning: compare all strings character-by-character at each position instead of trimming one candidate prefix, stopping at the first mismatched column."],
        gotchas: ["`strs[i].find(prefix) != 0` confirms `prefix` occurs starting AT INDEX 0 of `strs[i]` — a plain 'contains' check instead of confirming it's at the very start would wrongly accept a prefix that merely appears somewhere in the middle."]
      },
      {
        name: "Rotate String",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/rotate-string/",
        idea: "s is a rotation of goal exactly when goal can be found somewhere inside the string formed by concatenating s with itself — every possible rotation of s appears as some substring of s + s (splitting s at any point and swapping the two halves is exactly what a substring window of s+s captures).",
        time: "O(n) with an efficient substring search (e.g. KMP); O(n^2) with a naive one", space: "O(n) for the doubled string",
        code: `bool rotateString(string s, string goal) {
    if (s.size() != goal.size()) return false;
    string doubled = s + s;
    return doubled.find(goal) != string::npos;
}`,
        variations: ["The same 's + s contains X' trick answers 'is X a rotation of s' for any X, not just checking one given goal string."],
        gotchas: ["Skipping the length check first isn't just a minor inefficiency — `goal` could otherwise be found inside `s+s` purely by coincidence even when the two strings are different lengths and can't possibly be rotations of each other."]
      }
    ]
  },

  {
    id: "string-rebuild-pieces",
    name: "Scan Into Pieces, Then Rebuild",
    color: "#4ade80",
    icon: "string-rebuild-pieces",
    trigger: "Breaking a string into meaningful chunks — words, or runs of identical characters — then constructing a new string from those chunks",
    summary: "Both problems here make a single pass that groups the input into pieces (whitespace-delimited words, or runs of consecutive identical characters), and then build a brand-new output string directly from those pieces rather than mutating the original in place.",
    problems: [
      {
        name: "Reverse every word in a string",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reverse-words-in-a-string/",
        idea: "Split the string into words on whitespace, discarding any empty tokens produced by multiple consecutive spaces, then rebuild the string with the words in REVERSED order, joined by single spaces. This is a word-level reversal, not a character-level one — the letters inside each word stay untouched.",
        time: "O(n)", space: "O(n) for the word list and result",
        code: `string reverseWords(string s) {
    istringstream iss(s);
    vector<string> words;
    string word;
    while (iss >> word) words.push_back(word); // >> automatically skips whitespace

    string res;
    for (int i = (int)words.size() - 1; i >= 0; i--) {
        res += words[i];
        if (i > 0) res += ' ';
    }
    return res;
}`,
        variations: ["Reverse a String II (in the two-pointer group above) reverses CHARACTERS within fixed-size chunks; this reverses WORDS as whole units — the same 'reverse the order of pieces' idea at a different granularity.", "Do it in-place with O(1) extra space (beyond the output) by reversing the whole string first, then reversing each word back — a classic two-reversal trick."],
        gotchas: ["`istringstream >> word` conveniently skips leading/trailing/repeated spaces for free — a manual split on `' '` instead would need explicit handling of the empty tokens consecutive spaces produce."]
      },
      {
        name: "Count and say",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/count-and-say/",
        idea: "Starting from '1', repeatedly build the NEXT term from the current one by scanning it left to right in runs of identical consecutive characters, and appending 'count of the run' followed by 'the digit itself' for every run encountered. Repeating this scan-and-encode step (n-1) times, each time treating the freshly built string as the new input, produces the nth term.",
        time: "Roughly O(2^n) — the string can nearly double in length each iteration in the worst case", space: "Matches the final string's length",
        code: `string countAndSay(int n) {
    string result = "1";
    for (int iter = 1; iter < n; iter++) {
        string next;
        int i = 0;
        while (i < (int)result.size()) {
            char digit = result[i];
            int count = 0;
            while (i < (int)result.size() && result[i] == digit) { count++; i++; }
            next += to_string(count) + digit;
        }
        result = next;
    }
    return result;
}`,
        variations: ["Reverse every word in a string above also scans and regroups a string into meaningful chunks before rebuilding it — there it's whitespace-delimited words, here it's runs of identical characters."],
        gotchas: ["The inner `while` loop must advance `i` past the ENTIRE run before appending to `next`, not just look at one character — appending after checking only a single character breaks the encoding for any run longer than 1."]
      }
    ]
  },

  {
    id: "string-bracket-balance",
    name: "Stack-Based Bracket Matching",
    color: "#f87171",
    icon: "string-bracket-balance",
    trigger: "Deciding how much work it takes to fix an unbalanced sequence of brackets",
    summary: "The one bracket-matching problem in this topic — cancel out already-matching pairs first, then reason about whatever's left over. It's the same 'cancel, then count leftovers' instinct that shows up across nearly every bracket problem, even the ones needing a full stack instead of two counters.",
    problems: [
      {
        name: "Minimum number of bracket reversals to make an expression balanced",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/minimum-number-of-bracket-reversals-to-make-an-expression-balanced/",
        idea: "First cancel out every already-matching pair (a running counter of unmatched '{' does this without needing an explicit stack), which leaves behind only some unmatched closing brackets followed by unmatched opening brackets — e.g. '}}{{'. Every leftover pair of the form '}{' needs exactly ONE reversal to fix, while a leftover pair of the SAME bracket type ('}}' or '{{') needs TWO reversals (flip one of them to make a matching pair). Counting the leftover '}' and '{' separately and combining them with this rule gives the minimum.",
        time: "O(n)", space: "O(1)",
        code: `int minReversals(string expr) {
    int n = expr.size();
    if (n % 2 != 0) return -1; // odd length can never be balanced

    int open = 0, close = 0; // unmatched '{' and '}' after cancelling matched pairs
    for (char c : expr) {
        if (c == '{') open++;
        else {
            if (open > 0) open--;      // matches an earlier unmatched '{'
            else close++;              // no '{' to match — stays unmatched '}'
        }
    }
    // 'open' unmatched '{' and 'close' unmatched '}' remain, e.g. "}}{{"
    return (open + 1) / 2 + (close + 1) / 2;
}`,
        variations: ["The same 'cancel matched pairs, then count leftovers' idea generalizes to checking/fixing balance across multiple bracket types ( ), [ ], { } together, usually with an explicit stack instead of two counters.", "Minimum Add to Make Parentheses Valid is the same leftover-counting idea, but insertions are allowed instead of only reversals."],
        gotchas: ["Every leftover '{{' or '}}' pair needs 2 reversals (only one of the two brackets actually gets flipped) — that's why the formula uses `(open + 1) / 2` and `(close + 1) / 2` separately rather than just halving the total leftover count.", "An odd-length string can never be balanced no matter how many reversals are made — check that first and return -1 immediately, rather than running the counting logic on it."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Two pointers converging inward — swap or compare", pattern: "string-two-pointer" },
  { keyword: "Count characters into a hash map, answer from the counts", pattern: "string-frequency" },
  { keyword: "One structural observation turns this into a single pass", pattern: "string-structural-trick" },
  { keyword: "Split into words or runs, then rebuild a new string", pattern: "string-rebuild-pieces" },
  { keyword: "Cancel matched brackets, count and price the leftovers", pattern: "string-bracket-balance" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.strings = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();