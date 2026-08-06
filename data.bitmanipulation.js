// ============================================================
// DSA Bit Manipulation — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["bitmanipulation"]
// so multiple topic files can coexist without clashing on names.
// ============================================================
(function () {

const TOPIC = {
  id: "bitmanipulation",
  title: "Bit Manipulation",
  tagline: "Underneath every number is a row of 1s and 0s. A handful of small tricks on those bits solve problems that look nothing alike on the surface."
};

const PATTERNS = [
  {
    id: "bit-basics",
    name: "Bit Manipulation Basics",
    color: "#4ea8de",
    icon: "bit-basics",
    trigger: "Reading or flipping individual bits, checking odd/even or powers of two, or doing arithmetic without the usual operators",
    summary: "A small toolkit of one-liners — set a bit, clear a bit, check a bit, count them — that everything else in this topic is built out of.",
    problems: [
      {
        name: "Introduction to Bits and Tricks",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/bitwise-algorithms/",
        idea: "Every integer is stored as a row of binary digits (bits), and there are six operators for working with them directly: `&` (AND — 1 only where both bits are 1), `|` (OR — 1 where either bit is 1), `^` (XOR — 1 where the bits differ), `~` (NOT — flips every bit), `<<` (shift left — multiplies by 2 per shift), and `>>` (shift right — divides by 2 per shift). Almost every trick in this topic is just a clever combination of these six operators.",
        time: "O(1) per operation", space: "O(1)",
        code: `int a = 12;  // binary: 1100
int b = 10;  // binary: 1010

int andResult = a & b;   // 1000 = 8   (1 only where BOTH bits are 1)
int orResult  = a | b;   // 1110 = 14  (1 where EITHER bit is 1)
int xorResult = a ^ b;   // 0110 = 6   (1 where the bits DIFFER)
int notResult = ~a;      // flips every bit (including the sign bit)
int leftShift  = a << 1; // 11000 = 24 (shifting left multiplies by 2)
int rightShift = a >> 1; // 0110 = 6   (shifting right divides by 2, rounding down)`,
        variations: [],
        gotchas: ["`~` also flips the sign bit, so `~a` is NOT simply 'the opposite bits of a as a positive number' — it follows two's complement rules, giving `-(a+1)`."]
      },
      {
        name: "Check if the i-th Bit Is Set",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/how-to-check-if-i-th-bit-is-set-in-a-number/",
        idea: "Shift the number right by i places so the bit you care about lands in the very last position, then mask everything else away with `& 1`. Whatever's left is exactly that one bit's value.",
        time: "O(1)", space: "O(1)",
        code: `bool isBitSet(int n, int i) {
    return (n >> i) & 1;
}`,
        variations: ["Equivalently: `n & (1 << i)` — shift a single 1 into position i instead, and check if that bit survives the AND."],
        gotchas: []
      },
      {
        name: "Check if a Number Is Odd or Not",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/program-to-find-whether-a-no-is-power-of-two/",
        idea: "In binary, only the very last bit determines odd or even — every power of 2 above that only ever contributes an even amount. So checking `n & 1` (is the last bit set?) is a faster, branch-free alternative to `n % 2`.",
        time: "O(1)", space: "O(1)",
        code: `bool isOdd(int n) {
    return n & 1;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Check if a Number Is a Power of 2",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/power-of-two/",
        idea: "A power of 2 has exactly ONE bit set (e.g. 8 is `1000`). Subtracting 1 from it flips that single set bit to 0 and turns every bit below it to 1 (e.g. 7 is `0111`) — so a power of 2 ANDed with itself-minus-1 always gives 0. Any number that ISN'T a power of 2 has more than one set bit, and this trick won't zero it out.",
        time: "O(1)", space: "O(1)",
        code: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
        variations: [],
        gotchas: ["The `n > 0` check matters — 0 would otherwise incorrectly pass, since `0 & (0-1)` also happens to equal 0."]
      },
      {
        name: "Count the Number of Set Bits",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/number-of-1-bits/",
        idea: "Brian Kernighan's trick: `n & (n-1)` always clears exactly the LOWEST set bit of n (same idea as the power-of-2 check above, just used repeatedly). Keep clearing the lowest set bit and counting how many times you could do it — that count is the total number of set bits, and it only takes as many iterations as there are set bits, not the full bit-width of the number.",
        time: "O(number of set bits)", space: "O(1)",
        code: `int countSetBits(int n) {
    int count = 0;
    while (n) {
        n &= (n - 1); // clears the lowest set bit
        count++;
    }
    return count;
}`,
        variations: ["C++ also has a built-in for this: `__builtin_popcount(n)` — fine to use directly, but know how to derive it by hand too."],
        gotchas: []
      },
      {
        name: "Set / Unset the Rightmost Unset Bit",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/set-rightmost-unset-bit/",
        idea: "To SET the rightmost unset (0) bit: OR-ing n with (n+1) does exactly this — adding 1 always flips the rightmost run of 1s to 0s and the first 0 after them to a 1, and OR-ing keeps everything else unchanged. To UNSET the rightmost set (1) bit, reuse the familiar `n & (n-1)` trick from Brian Kernighan's algorithm above.",
        time: "O(1)", space: "O(1)",
        code: `int setRightmostUnsetBit(int n) {
    return n | (n + 1);
}
int unsetRightmostSetBit(int n) {
    return n & (n - 1);
}`,
        variations: [],
        gotchas: ["If n is already all 1s (like 0b1111), there's no unset bit to set — `n | (n+1)` still computes, just double check whether that edge case matters for your use."]
      },
      {
        name: "Swap Two Numbers Without a Temp Variable",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/swap-two-numbers-without-using-temporary-variable/",
        idea: "XOR-ing a value with itself gives 0, and XOR-ing with 0 leaves a value unchanged — chaining three XORs between two variables exploits this to swap them without ever needing a third variable to hold one value temporarily.",
        time: "O(1)", space: "O(1)",
        code: `void swapNoTemp(int& a, int& b) {
    a ^= b;
    b ^= a;
    a ^= b;
}`,
        variations: [],
        gotchas: ["This breaks if `a` and `b` are the SAME variable (same memory address) — XOR-ing a value with itself repeatedly zeroes it out entirely. In practice, `std::swap` handles this correctly and should be preferred; this trick is more of an interview curiosity."]
      },
      {
        name: "Divide Two Numbers Without Multiplication, Division, or Mod",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/divide-two-integers/",
        idea: "Instead of subtracting the divisor one at a time (too slow), double it repeatedly using left-shifts — 1x, 2x, 4x, 8x — for as long as it still fits inside what's left of the dividend. Subtract off the biggest one that fits, add the matching power of 2 to the answer, and repeat with whatever remains.",
        time: "O(log²(dividend))", space: "O(1)",
        code: `int divide(int dividend, int divisor) {
    if (dividend == INT_MIN && divisor == -1) return INT_MAX; // overflow guard
    bool negative = (dividend < 0) != (divisor < 0);
    long a = labs((long)dividend), b = labs((long)divisor);
    long result = 0;
    while (a >= b) {
        long temp = b, multiple = 1;
        while (a >= (temp << 1)) { temp <<= 1; multiple <<= 1; }
        a -= temp;
        result += multiple;
    }
    return negative ? -result : result;
}`,
        variations: [],
        gotchas: ["Watch the classic overflow edge case: dividing `INT_MIN` by `-1` overflows a 32-bit int — handle it as a special case up front."]
      }
    ]
  },

  {
    id: "bit-interview",
    name: "Bit Manipulation Interview Problems",
    color: "#7c6bff",
    icon: "bit-interview",
    trigger: "\"Find the one number that's different\" · needs zero extra memory and numbers come in pairs · generate every subset · XOR over a range",
    summary: "XOR cancels out matching pairs of numbers, and a few small bit tricks can isolate exactly the bit you need — handy whenever a hashmap would work but the question wants zero extra memory.",
    problems: [
      {
        name: "Minimum Bit Flips to Convert a Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/",
        idea: "XOR-ing start and goal produces a number whose set bits are EXACTLY the positions where the two numbers differ — every one of those differing bits needs exactly one flip. So the answer is just the set-bit count of `start ^ goal`.",
        time: "O(number of set bits)", space: "O(1)",
        code: `int minBitFlips(int start, int goal) {
    int diff = start ^ goal;
    int count = 0;
    while (diff) { diff &= (diff - 1); count++; }
    return count;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Single Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/single-number/",
        idea: "XOR has a neat property: any number XORed with itself becomes 0, and the order you XOR things in doesn't matter. So if every number except one shows up exactly twice, XORing the whole array together cancels out every pair, leaving only the lonely number standing.",
        time: "O(n)", space: "O(1)",
        code: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x;
    return res;
}`,
        variations: ["Single Number II (everything else appears 3 times — needs counting bits at each position)", "Single Number III (two unique numbers instead of one)"],
        gotchas: []
      },
      {
        name: "Single Number III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/single-number-iii/",
        idea: "With two unique numbers instead of one, XORing everything gives you (a XOR b), not either number by itself. But that result still tells you something: any bit that's turned on in it must be different between a and b. Pick one such bit, and use it to split the whole array into two groups — a and b are guaranteed to land in different groups. XOR each group on its own to get each number.",
        time: "O(n)", space: "O(1)",
        code: `vector<int> singleNumber3(vector<int>& nums) {
    int xorAll = 0;
    for (int x : nums) xorAll ^= x;
    int diffBit = xorAll & (-xorAll); // lowest set bit
    int a = 0;
    for (int x : nums) if (x & diffBit) a ^= x;
    int b = xorAll ^ a;
    return {a, b};
}`,
        variations: [],
        gotchas: ["`x & (-x)` is a handy trick that isolates the lowest 'on' bit of a number — it shows up in a lot of bit problems."]
      },
      {
        name: "Counting Bits",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/counting-bits/",
        idea: "Instead of counting the bits of every number from scratch, notice that any number is just a smaller number (itself shifted right by one) with one extra bit tacked on. So its bit count is: the bit count of that smaller number, plus 1 if the original number is odd. You can build the whole answer list using answers you already calculated.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> countBits(int n) {
    vector<int> res(n + 1, 0);
    for (int i = 1; i <= n; i++) res[i] = res[i >> 1] + (i & 1);
    return res;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Power Set (All Subsets via Bitmasking)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subsets/",
        idea: "A set of n elements has exactly 2ⁿ subsets, and every number from 0 to 2ⁿ-1 already has a unique pattern of n bits — treat each number as a 'recipe' where bit i being set means 'include element i'. Loop through every number in that range, and for each one, build the subset it describes by checking each bit.",
        time: "O(n · 2ⁿ)", space: "O(n · 2ⁿ) for the output",
        code: `vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> result;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) subset.push_back(nums[i]);
        }
        result.push_back(subset);
    }
    return result;
}`,
        variations: [],
        gotchas: ["This only works cleanly for n up to about 20 — beyond that, 2ⁿ becomes too large to enumerate at all, bitmask or not."]
      },
      {
        name: "XOR of Numbers in a Given Range",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/calculate-xor-1-n/",
        idea: "XOR-ing 1 through n directly would be O(n), but there's a repeating 4-step pattern for XOR(1..n) based on `n % 4`: it's always n, 1, n+1, or 0 depending on the remainder — no loop needed. Once you can compute XOR(1..n) in O(1), the XOR of any range [l, r] is just `XOR(1..r) ^ XOR(1..l-1)`, the same 'prefix difference' idea used for prefix sums.",
        time: "O(1)", space: "O(1)",
        code: `int xorUpTo(int n) {
    if (n % 4 == 0) return n;
    if (n % 4 == 1) return 1;
    if (n % 4 == 2) return n + 1;
    return 0; // n % 4 == 3
}
int xorInRange(int l, int r) {
    return xorUpTo(r) ^ xorUpTo(l - 1);
}`,
        variations: [],
        gotchas: ["This is the XOR equivalent of a prefix sum — same 'subtract off everything before the range' idea, just with XOR instead of addition."]
      }
    ]
  },

  {
    id: "advanced-maths",
    name: "Advanced Maths for Interviews",
    color: "#f5a524",
    icon: "advanced-maths",
    trigger: "Primes, divisors, or exponents — number-theory questions that show up in interviews rather than pure array/string tricks",
    summary: "Not bit tricks exactly, but this cluster of number-theory basics gets asked constantly alongside bit manipulation questions, and fast exponentiation genuinely IS a bit trick underneath.",
    problems: [
      {
        name: "Print Prime Factors of a Number",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/print-all-prime-factors-of-a-given-number/",
        idea: "Try dividing out every possible factor starting from 2, dividing repeatedly by the SAME factor as long as it still divides evenly (this naturally handles repeated prime factors like 8 = 2×2×2). You only ever need to check up to √n, because if n still has a factor bigger than its square root at that point, that remaining piece must itself be prime.",
        time: "O(√n)", space: "O(1) extra (excl. output)",
        code: `vector<int> primeFactors(int n) {
    vector<int> factors;
    for (int i = 2; (long)i * i <= n; i++) {
        while (n % i == 0) {
            factors.push_back(i);
            n /= i;
        }
    }
    if (n > 1) factors.push_back(n); // whatever's left is itself prime
    return factors;
}`,
        variations: [],
        gotchas: ["The final `if (n > 1)` check is easy to forget — it catches the case where a single large prime factor survives past the √n loop."]
      },
      {
        name: "Divisors of a Number",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/find-all-divisors-of-a-natural-number-set-2/",
        idea: "Divisors always come in pairs that multiply to n (like 2 and 6 for n=12). So you only need to check candidates up to √n — for every divisor i found there, `n / i` is automatically its pairing partner.",
        time: "O(√n)", space: "O(1) extra (excl. output)",
        code: `vector<int> divisors(int n) {
    vector<int> result;
    for (int i = 1; (long)i * i <= n; i++) {
        if (n % i == 0) {
            result.push_back(i);
            if (i != n / i) result.push_back(n / i);
        }
    }
    return result;
}`,
        variations: [],
        gotchas: ["Skip adding `n / i` a second time when i is the exact square root (`i == n / i`) — otherwise a perfect square's middle divisor gets counted twice."]
      },
      {
        name: "Count Primes in Range L to R (Sieve of Eratosthenes)",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/sieve-of-eratosthenes/",
        idea: "Checking each number in the range individually for primality is too slow if the range is large. Instead, mark off ALL multiples of every prime starting from 2, up to the range's limit, in one pass — whatever's left unmarked is prime. This 'cross off multiples' approach only touches each composite number once per prime factor, making it much faster than checking numbers one at a time.",
        time: "O(N log log N) to build the sieve", space: "O(N)",
        code: `vector<bool> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; (long)i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) isPrime[j] = false;
        }
    }
    return isPrime;
}
int countPrimesInRange(int l, int r) {
    vector<bool> isPrime = sieveOfEratosthenes(r);
    int count = 0;
    for (int i = l; i <= r; i++) if (isPrime[i]) count++;
    return count;
}`,
        variations: ["Segmented Sieve (when R is huge but R-L is small — sieve only the range itself using primes up to √R, instead of building a sieve all the way up to R)"],
        gotchas: ["Starting the inner loop at `i * i` (not `2*i`) is what keeps the sieve fast — every smaller multiple of i has already been crossed off by a smaller prime factor."]
      },
      {
        name: "Prime Factorization of a Number (Smallest Prime Factor Sieve)",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/find-smallest-prime-divisor-number/",
        idea: "If you need to prime-factorize MANY numbers (not just one), it pays to precompute the smallest prime factor (SPF) of every number up to some limit, once, using a sieve. After that, factorizing any number is just: repeatedly divide by its SPF and look up the SPF of the result, until it becomes 1 — no trial division needed per query.",
        time: "O(N log log N) to build the sieve, O(log n) per factorization query", space: "O(N)",
        code: `vector<int> smallestPrimeFactorSieve(int n) {
    vector<int> spf(n + 1);
    for (int i = 1; i <= n; i++) spf[i] = i;
    for (int i = 2; (long)i * i <= n; i++) {
        if (spf[i] == i) { // i is prime
            for (int j = i * i; j <= n; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }
    return spf;
}
vector<int> factorizeUsingSPF(int n, vector<int>& spf) {
    vector<int> factors;
    while (n > 1) {
        factors.push_back(spf[n]);
        n /= spf[n];
    }
    return factors;
}`,
        variations: [],
        gotchas: ["Only worth the setup cost if you're factorizing many numbers — for a single one-off factorization, plain trial division (see 'Print Prime Factors') is simpler and just as fast."]
      },
      {
        name: "Pow(x, n) — Fast Exponentiation",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/powx-n/",
        idea: "Multiplying x by itself n times is O(n) — too slow for large n. Instead, use the fact that xⁿ = (x²)^(n/2), halving the exponent at every step instead of decrementing it by 1. This is genuinely a bit trick in disguise: at each step you're looking at the lowest bit of n (odd or even) to decide whether to fold in an extra factor of x, then shifting n right by one — it's the same 'process n bit by bit' idea running underneath.",
        time: "O(log n)", space: "O(1)",
        code: `double myPow(double x, int n) {
    long exp = n; // widen to avoid overflow when negating INT_MIN
    if (exp < 0) { x = 1 / x; exp = -exp; }
    double result = 1;
    while (exp > 0) {
        if (exp & 1) result *= x; // lowest bit set — fold in this power of x
        x *= x;                  // square x — moving to the next bit's weight
        exp >>= 1;                // move to the next bit
    }
    return result;
}`,
        variations: [],
        gotchas: ["Negating `n` directly overflows when `n == INT_MIN` — widen to a `long` before negating, exactly like the overflow guard in integer division."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Check, set, or count individual bits", pattern: "bit-basics" },
  { keyword: "\"Find the one number that's different\"", pattern: "bit-interview" },
  { keyword: "Generate every subset of a set", pattern: "bit-interview" },
  { keyword: "Primes, divisors, or fast exponentiation", pattern: "advanced-maths" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.bitmanipulation = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();