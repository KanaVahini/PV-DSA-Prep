// ============================================================
// DSA Linked List — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["linkedlist"] so
// multiple topic files can coexist without clashing on names.
//
// Code snippets assume a plain node shape: { val, next }
// ============================================================
(function () {

const TOPIC = {
  id: "linkedlist",
  title: "Linked List",
  tagline: "No indexes here — just pointers. Learn a handful of pointer moves and most linked list questions fall into place."
};

const PATTERNS = [
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    color: "#46c2c2",
    icon: "fast-slow-pointers",
    trigger: "Detect a cycle · find the middle node · check something structural about the list, all without extra memory",
    summary: "Two pointers move through the list at different speeds — one step at a time, and two steps at a time. If they ever meet, there's a loop. If the fast one finishes, the slow one is sitting right in the middle.",
    problems: [
      {
        name: "Linked List Cycle",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/linked-list-cycle/",
        idea: "Send two pointers down the list — one moves one node at a time, the other moves two nodes at a time. If there's no cycle, the fast pointer simply reaches the end and stops. But if there IS a cycle, the fast pointer eventually laps the slow one, and they land on the exact same node — that's your proof a loop exists.",
        time: "O(n)", space: "O(1)",
        code: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;
}
return false;`,
        variations: ["Linked List Cycle II (find exactly where the cycle starts)"],
        gotchas: ["Always check both `fast` and `fast.next` before moving it — otherwise you'll crash trying to read `.next.next` off a null node."]
      },
      {
        name: "Linked List Cycle II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/linked-list-cycle-ii/",
        idea: "First find the meeting point using the slow/fast trick from Cycle I. Then here's the clever bit: put a new pointer back at the very start of the list, and move it and the meeting-point pointer forward one step at a time, together. They'll meet again exactly at the start of the cycle — it's a bit of math that always works out this way.",
        time: "O(n)", space: "O(1)",
        code: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next; fast = fast.next.next;
  if (slow === fast) {
    let ptr = head;
    while (ptr !== slow) { ptr = ptr.next; slow = slow.next; }
    return ptr;
  }
}
return null;`,
        variations: [],
        gotchas: ["It's fine if this feels like magic the first time — moving one pointer from the head and one from the meeting point, both one step at a time, always converges at the cycle's start."]
      },
      {
        name: "Middle of the Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/middle-of-the-linked-list/",
        idea: "Move one pointer twice as fast as the other. By the time the fast one reaches the end of the list, the slow one — moving at half the speed — is sitting exactly in the middle.",
        time: "O(n)", space: "O(1)",
        code: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
}
return slow;`,
        variations: [],
        gotchas: ["If the list has an even number of nodes, this naturally lands on the second of the two middle nodes — double check which one the question actually wants."]
      },
      {
        name: "Palindrome Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/palindrome-linked-list/",
        idea: "Find the middle of the list using the fast/slow trick, reverse the second half in place, then walk both halves from their starting points, comparing values as you go. If every pair matches, it's a palindrome.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the middle with slow/fast pointers
// 2. reverse the second half
// 3. compare the first half and reversed second half node by node`,
        variations: [],
        gotchas: ["Reversing the second half in place is what gets you down to O(1) space — copying values into an array works too, but that uses O(n) space instead."]
      }
    ]
  },

  {
    id: "reversal",
    name: "In-Place Reversal",
    color: "#f2884f",
    icon: "reversal",
    trigger: "Reverse the whole list, or reverse it in groups or ranges",
    summary: "Walk through the list once, flipping each node's `next` pointer to point backward instead of forward, carefully keeping track of where you came from.",
    problems: [
      {
        name: "Reverse Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        idea: "Keep track of the node right before the one you're looking at. At each node, before moving on, flip its `next` pointer to point backward at the previous node instead of forward. Then shift everything along — previous becomes current, current becomes next — and repeat.",
        time: "O(n)", space: "O(1)",
        code: `let prev = null, cur = head;
while (cur) {
  const next = cur.next;
  cur.next = prev;
  prev = cur;
  cur = next;
}
return prev;`,
        variations: ["Reverse Linked List II (only reverse part of the list)", "Reverse Nodes in k-Group"],
        gotchas: ["Save `cur.next` into a temporary variable BEFORE you overwrite it — otherwise you lose your way forward through the rest of the list."]
      },
      {
        name: "Reverse Linked List II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reverse-linked-list-ii/",
        idea: "Walk to the node right before where the reversal should start, and hold onto it. Reverse just that middle section using the normal reversal trick. Then reconnect: the piece before the section links to the new start of the reversed part, and the old start (now at the end of the reversed section) links to whatever comes right after.",
        time: "O(n)", space: "O(1)",
        code: `// walk to the node before position 'left', remember it as 'beforeStart'
// reverse the nodes from 'left' to 'right' using the standard reversal loop
// reconnect: beforeStart.next -> new head of the reversed section
//            old start of the section -> node right after 'right'`,
        variations: [],
        gotchas: ["Using a dummy node placed before the head avoids annoying edge cases when the reversal starts right at position 1."]
      },
      {
        name: "Reverse Nodes in k-Group",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        idea: "Same reversal trick as before, just repeated on chunks of k nodes at a time. Before reversing each chunk, check there are actually k nodes left to reverse — if fewer than k remain, leave that last leftover chunk exactly as it is.",
        time: "O(n)", space: "O(1)",
        code: `// check there are at least k nodes remaining
// reverse the next k nodes using the standard reversal loop
// connect the previous chunk's tail to this chunk's new head
// repeat for the next chunk`,
        variations: [],
        gotchas: ["Counting ahead to make sure k nodes actually exist before reversing is the step people skip — it's exactly what handles the leftover partial group correctly."]
      },
      {
        name: "Swap Nodes in Pairs",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/swap-nodes-in-pairs/",
        idea: "This is really just 'Reverse Nodes in k-Group' with k fixed at 2. Swap every pair of neighboring nodes by carefully re-pointing three links at a time, then move on to the next pair.",
        time: "O(n)", space: "O(1)",
        code: `const dummy = { next: head };
let prev = dummy;
while (prev.next && prev.next.next) {
  const first = prev.next, second = first.next;
  first.next = second.next;
  second.next = first;
  prev.next = second;
  prev = first;
}
return dummy.next;`,
        variations: [],
        gotchas: ["A dummy node placed before the head makes swapping the very first pair much less fiddly to write."]
      }
    ]
  },

  {
    id: "gap-technique",
    name: "Two-Pointer Gap",
    color: "#8f6bf2",
    icon: "gap-technique",
    trigger: "Find something 'n nodes from the end' · needs to be solved in a single pass",
    summary: "Move one pointer out ahead first to create a fixed gap between it and a second pointer. Then move both together — when the front one hits the end, the back one is exactly where you need it.",
    problems: [
      {
        name: "Remove Nth Node From End of List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        idea: "Send one pointer n steps ahead first. Then move both pointers forward together, one step at a time. Thanks to that head start, by the time the front pointer reaches the end, the back pointer is sitting exactly n nodes from the end — right where you need to remove a node.",
        time: "O(n)", space: "O(1)",
        code: `const dummy = { next: head };
let fast = dummy, slow = dummy;
for (let i = 0; i < n; i++) fast = fast.next;
while (fast.next) { fast = fast.next; slow = slow.next; }
slow.next = slow.next.next;
return dummy.next;`,
        variations: [],
        gotchas: ["Use a dummy node before the head — without it, removing the very first node of the list becomes an annoying special case."]
      },
      {
        name: "Intersection of Two Linked Lists",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        idea: "If the two lists are different lengths, walking them side by side won't line up at the intersection point. The trick: walk pointer A to the end of list A, then send it down list B; walk pointer B to the end of list B, then send it down list A. Both pointers end up traveling the exact same total distance, so they arrive at the intersection point (or both hit the end) at exactly the same time.",
        time: "O(m+n)", space: "O(1)",
        code: `let a = headA, b = headB;
while (a !== b) {
  a = a ? a.next : headB;
  b = b ? b.next : headA;
}
return a;`,
        variations: [],
        gotchas: ["This still works correctly even when the lists never intersect — both pointers simply reach null at the same time, and you correctly return null."]
      },
      {
        name: "Rotate List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rotate-list/",
        idea: "First figure out the list's length and connect its tail back to its head — turning it into a circle for a moment. Then walk forward to find where the new break should be, and cut the circle open there to get the rotated list.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the length and the tail, then connect tail.next = head
// 2. walk (length - k % length) steps from head to find the new tail
// 3. break the circle: newHead = newTail.next; newTail.next = null`,
        variations: [],
        gotchas: ["Always reduce k with `k % length` first — rotating by the full length (or a multiple of it) changes nothing, and skipping this makes you loop around far more than necessary."]
      }
    ]
  },

  {
    id: "dummy-node",
    name: "Dummy Node Technique",
    color: "#f2c14f",
    icon: "dummy-node",
    trigger: "The head of the list itself might need to change or get removed · merging or inserting nodes",
    summary: "Create a fake node that points at the real head before you start working. It means you never have to write special-case code for 'what if the head changes' — you just return dummy.next at the very end.",
    problems: [
      {
        name: "Merge Two Sorted Lists",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/merge-two-sorted-lists/",
        idea: "This works exactly like merging two sorted arrays. Keep a pointer building the new list, and at every step attach whichever of the two current nodes has the smaller value. A dummy starting node means you don't need any special logic for picking the very first node of the result.",
        time: "O(m+n)", space: "O(1)",
        code: `const dummy = { next: null };
let cur = dummy;
while (l1 && l2) {
  if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
  else { cur.next = l2; l2 = l2.next; }
  cur = cur.next;
}
cur.next = l1 || l2;
return dummy.next;`,
        variations: ["Merge K Sorted Lists (repeat this merge, or use a min-heap)"],
        gotchas: []
      },
      {
        name: "Remove Linked List Elements",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/remove-linked-list-elements/",
        idea: "Without a dummy node, deleting a matching value right at the start of the list needs different code than deleting one in the middle. With a dummy node sitting before the real head, both cases become identical — just skip past any node whose value matches what you're removing.",
        time: "O(n)", space: "O(1)",
        code: `const dummy = { next: head };
let cur = dummy;
while (cur.next) {
  if (cur.next.val === val) cur.next = cur.next.next;
  else cur = cur.next;
}
return dummy.next;`,
        variations: [],
        gotchas: []
      },
      {
        name: "Partition List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/partition-list/",
        idea: "Build two separate lists as you scan through the original one — one collecting everything smaller than x, one collecting everything else. At the end, just join the second list onto the tail of the first. Two dummy nodes make both lists easy to build without special-casing their starts.",
        time: "O(n)", space: "O(1)",
        code: `const beforeDummy = { next: null }, afterDummy = { next: null };
let before = beforeDummy, after = afterDummy;
let cur = head;
while (cur) {
  if (cur.val < x) { before.next = cur; before = cur; }
  else { after.next = cur; after = cur; }
  cur = cur.next;
}
after.next = null;
before.next = afterDummy.next;
return beforeDummy.next;`,
        variations: [],
        gotchas: ["Don't forget to cut off the end of the second list with `after.next = null` — skipping this can leave a leftover loop in the final list."]
      },
      {
        name: "Add Two Numbers",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/add-two-numbers/",
        idea: "Each list stores one digit per node, in reverse order — so this is really just long addition, done one digit (node) at a time, carrying over into the next digit whenever a sum hits double digits. A dummy node makes building the result list simple.",
        time: "O(max(m,n))", space: "O(max(m,n))",
        code: `const dummy = { next: null };
let cur = dummy, carry = 0;
while (l1 || l2 || carry) {
  const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
  carry = Math.floor(sum / 10);
  cur.next = { val: sum % 10, next: null };
  cur = cur.next;
  l1 = l1 && l1.next; l2 = l2 && l2.next;
}
return dummy.next;`,
        variations: [],
        gotchas: ["Don't stop just because both lists have run out — if there's still a leftover carry, you need one more node for it."]
      }
    ]
  },

  {
    id: "merge-sort-ll",
    name: "Divide & Merge",
    color: "#6bcf7f",
    icon: "merge-sort-ll",
    trigger: "Sort an entire linked list · merge many already-sorted lists together",
    summary: "Linked lists can't be split and rejoined randomly like arrays, but they're a perfect fit for merge sort — splitting in half is easy, and merging two sorted lists is a clean, well-known trick.",
    problems: [
      {
        name: "Sort List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sort-list/",
        idea: "Use merge sort: find the middle of the list with the fast/slow pointer trick and split it into two halves, sort each half the same way, then merge the two sorted halves back together using the standard merge-two-sorted-lists trick.",
        time: "O(n log n)", space: "O(log n) for the recursion",
        code: `// 1. base case: 0 or 1 nodes is already sorted
// 2. find the middle with fast/slow pointers, split into two halves
// 3. recursively sort each half
// 4. merge the two sorted halves (same as Merge Two Sorted Lists)`,
        variations: [],
        gotchas: ["Remember to actually cut the list into two separate halves (set the middle node's `next` to null) — forgetting this creates an infinite loop."]
      },
      {
        name: "Merge K Sorted Lists",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/merge-k-sorted-lists/",
        idea: "The simplest approach: merge the lists two at a time, the same way you'd merge two sorted lists, and keep repeating until only one list remains — that's really merge sort applied to a list of lists. A small priority queue (min-heap) that always grabs the smallest current node across all the lists is a faster, more scalable way to do it.",
        time: "O(n log k) with a heap, where n is total nodes and k is the number of lists", space: "O(k) for the heap",
        code: `// Option A: repeatedly merge pairs of lists until one remains (merge-sort style)
// Option B: put the head of every list into a min-heap, always pop the smallest,
// push its .next back in, and repeat until the heap is empty`,
        variations: [],
        gotchas: ["Pairwise merging is easy to write, but the heap approach scales much better as k grows — it's usually the answer interviewers are hoping for."]
      }
    ]
  },

  {
    id: "rewiring",
    name: "In-Place Node Rewiring",
    color: "#f26b9d",
    icon: "rewiring",
    trigger: "Rearranging nodes without extra memory · copying a list that has extra or unusual pointers",
    summary: "Carefully re-point a handful of `next` (and sometimes `random`) pointers directly, instead of building a whole new list or needing extra memory to track where things map to.",
    problems: [
      {
        name: "Reorder List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reorder-list/",
        idea: "The reordering pattern (first, last, second, second-to-last, ...) is really just: find the middle, reverse the second half, and then weave the two halves together by alternating nodes from each one.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the middle with fast/slow pointers
// 2. reverse the second half
// 3. weave: alternate attaching nodes from the first half and the reversed second half`,
        variations: [],
        gotchas: []
      },
      {
        name: "Copy List with Random Pointer",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        idea: "The tricky part is copying the `random` pointers, since they can point anywhere in the list — including nodes you haven't made a copy of yet. The clean trick: weave a copy right next to each original node (original, copy, original, copy...). Now any node's copy is simply `original.next`, which makes setting up `random` pointers on the copies easy. Afterward, unweave the two lists back apart.",
        time: "O(n)", space: "O(1) extra (not counting the output list)",
        code: `// 1. weave: insert a copy right after each original node
// 2. set copy.random = original.random.next for every original node
// 3. unweave: separate the original list and the new copied list back apart`,
        variations: [],
        gotchas: ["Unweaving carefully at the end is easy to get wrong — double check both the original list's and the copy's `next` pointers end up clean, not tangled together."]
      },
      {
        name: "Odd Even Linked List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/odd-even-linked-list/",
        idea: "Build two separate chains as you walk through the list once — one collecting nodes at odd positions, one collecting nodes at even positions — then simply attach the even chain onto the end of the odd chain.",
        time: "O(n)", space: "O(1)",
        code: `if (!head) return head;
let odd = head, even = head.next, evenHead = even;
while (even && even.next) {
  odd.next = even.next;
  odd = odd.next;
  even.next = odd.next;
  even = even.next;
}
odd.next = evenHead;
return head;`,
        variations: [],
        gotchas: []
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Detect a cycle, or find the middle node", pattern: "fast-slow-pointers" },
  { keyword: "Reverse the whole list, or part of it", pattern: "reversal" },
  { keyword: "\"Nth node from the end\", in one pass", pattern: "gap-technique" },
  { keyword: "The head itself might change or get removed", pattern: "dummy-node" },
  { keyword: "Sort a list, or merge several sorted lists", pattern: "merge-sort-ll" },
  { keyword: "Rearranging nodes or copying complex pointers", pattern: "rewiring" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.linkedlist = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();