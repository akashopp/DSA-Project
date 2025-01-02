import java.util.*;
import java.io.*;

public class Solution {
  static Scanner sc = new Scanner(System.in);
  public static void main(String[] args) {
    int n = sc.nextInt(), sum = sc.nextInt();
    int[] arr = new int[n];
    for(int i = 0; i < n; i++) arr[i] = sc.nextInt();
    Map<Integer, Queue<Integer>> map = new HashMap<>();
    for(int i = 0; i < n; i++) {
      if(!map.containsKey(arr[i])) map.put(arr[i], new LinkedList<>());
      map.get(arr[i]).add(i);
    }
    for(int i = 0; i < n; i++) {
      int req = sum - arr[i];
      var q = map.getOrDefault(req, new LinkedList<>());
      while(!q.isEmpty() && q.peek() <= i) q.poll();
      if(!q.isEmpty()) {
        System.out.println(i + " " + q.poll());
        return;
      }
    }
    System.out.println("-1 -1");
  }
}