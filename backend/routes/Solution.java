import java.util.*;
import java.io.*;

public class Solution {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt(), sum = sc.nextInt();
    int[] arr = new int[n];
    for(int i = 0; i < n; i++) arr[i] = sc.nextInt();
    for(int i = 0; i < n; i++) for(int j = i + 1; j < n; j++) {
      if(arr[i] + arr[j] == sum) {
        System.out.println(i + " " + j);
        return;
      }
    }
    System.out.println("-1 -1");
  }
}